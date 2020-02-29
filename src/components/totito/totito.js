import React, { useEffect, useState } from "react"
import {
    useHistory,
    useLocation
} from "react-router-dom";

import { Rules } from './rulesToChooseMovement';

import { _showAlert } from '../helper/helper';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const Totito = () => {
    const logicCalculateNextMachineMoviment = Rules();
    let history = useHistory();
    let query = useQuery();

    const [isMachineTurn, setIsMachineTurn] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [username, setUsername] = useState('');
    const [cells, setCells] = useState([]);
    const [htmlCells, setHtmlCells] = useState([])
    const [winner, setWinner] = useState(undefined);

    useEffect(() => {
        const validateQueryParam = () => {
            const username = query.get("username");
            if (username == null) {
                history.push('/');
            }
            setUsername(username)
        };
        validateQueryParam();
    }, [history, query]);

    useEffect(() => {
        const numberOfCells = Array.from(Array(9), (d, i) => i)
        const cellsObjects = numberOfCells.map(element => {
            const defaulCell = {
                name: (element + 1),
                image: '/images/empty.png',
                isBlock: false,
                owner: 'empty'
            }
            return defaulCell
        })
        setCells(cellsObjects)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const htmlCells = cells.map((cell, index) => (
            < div className="col-xl-4 col-md-4 mb-4" key={index} >
                <a href="/" onClick={(e) => handlerClick(e, cell.name, cell.isBlock)}>
                    <img src={cell.image} alt={cell.name} width="100%" height="100%" />
                </a>
            </div >
        ));

        setHtmlCells(htmlCells)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cells])

    useEffect(() => {
        const calculateNextMoviment = async () => {
            let calculateSelection = null;
            const getAvailableCells = getCells('isBlock', false);
            const getUserCells = getCells('owner', 'user');
            const getMachineCells = getCells('owner', 'machine');

            if (getMachineCells.length === 0) {
                // First Move
                calculateSelection = await generateRandoMovement(getAvailableCells);
            } else {
                const selectCellToWin = await predictMovement(getMachineCells, getAvailableCells);
                calculateSelection = selectCellToWin;

                if (calculateSelection === null) {
                    const selectCellToBlock = await predictMovement(getUserCells, getAvailableCells);
                    calculateSelection = selectCellToBlock;
                }

                if (calculateSelection === null) {
                    calculateSelection = await generateRandoMovement(getAvailableCells);
                }
            }
            const selectCell = UseCell(cells, calculateSelection, false);
            setIsMachineTurn(false)
            setCells([
                ...selectCell
            ]);
            await validateMoviment('machine')
        }
        if (isMachineTurn && !isGameOver) {
            calculateNextMoviment()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMachineTurn])

    useEffect(() => {
        const determineWinner = () => {
            const message = winner === undefined ? 'Fin del juego, HAS EMPATADO' :
                winner === 'user' ? `Fin del juebo, Felicidades ${username} HAS GANADO` :
                    'Fin del juego, HAS PERDIDO';
            const typeAlert = winner === 'user' ? 'ok' : 'error';
            _showAlert(message, typeAlert)
                .then(() => {
                    history.push('/')
                });
        }
        if (isGameOver) {
            determineWinner()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGameOver])

    const renderRow = (start, end) => {
        return htmlCells.slice(start, end);
    }

    const handlerClick = async (e, nameCell, isBlock) => {
        e.preventDefault()
        if (!isBlock && !isMachineTurn && !isGameOver) {
            const selectCell = UseCell(cells, nameCell, true);
            setIsMachineTurn(true)
            setCells([
                ...selectCell
            ]);
            await validateMoviment('user')
        }
    }

    const UseCell = (array, nameCell, isUser) => {
        const index = array.findIndex(({ name }) => name === nameCell);
        array[index]['isBlock'] = true;
        array[index]['owner'] = isUser ? 'user' : 'machine';
        array[index]['image'] = isUser ? '/images/equis.png' : '/images/circle.png';
        return array
    }

    const generateRandoMovement = async (array) => array[Math.floor(Math.random() * array.length)];

    const isAvailableCell = (array, value) => array.find(element => element === value);

    const predictMovement = (arrayOfSelections, availableCells) => {
        try {
            let calculateCell = null;
            arrayOfSelections.forEach((firstKey, index) => {
                const sliceCells = arrayOfSelections.slice(index + 1, arrayOfSelections.length);
                sliceCells.forEach(secondKey => {
                    calculateCell = logicCalculateNextMachineMoviment[firstKey][secondKey]
                    if (calculateCell !== undefined) {
                        const isAvailableSelectedCell = isAvailableCell(availableCells, calculateCell);
                        if (isAvailableSelectedCell !== undefined) {
                            return calculateCell
                        } else {
                            calculateCell = null;
                        }
                    }

                })
            });
            return calculateCell === undefined || calculateCell === null ? null : calculateCell;
        } catch (e) {
            return null
        }
    }

    const searchWinner = (arrayOfSelections) => {
        try {
            let isWinner = false;
            arrayOfSelections.forEach((firstKey, index) => {
                const sliceCells = arrayOfSelections.slice(index + 1, arrayOfSelections.length);
                sliceCells.forEach((secondKey, indexTwo) => {
                    const sliceThree = sliceCells.slice(indexTwo + 1, sliceCells.length);
                    sliceThree.forEach((threeKey) => {
                        const expectedValue = logicCalculateNextMachineMoviment[firstKey][secondKey]
                        if (expectedValue === threeKey) {
                            isWinner = true;
                            return isWinner
                        }
                    })
                })
            });
            return isWinner;
        } catch (e) {
            return false
        }
    }

    const getCells = (key, value) => cells.filter(cell => cell[key] === value)
        .map(({ name }) => name).sort((a, b) => a - b);

    const validateMoviment = async (whoMadeTheMove) => {
        const availableCells = getCells('isBlock', false);
        if (availableCells.length === 0) {
            setIsGameOver(true)
            return true
        } else {
            const getUsedCells = getCells('owner', whoMadeTheMove);
            const hasWinner = searchWinner(getUsedCells);
            if (hasWinner) {
                setWinner(whoMadeTheMove)
                setIsGameOver(true, whoMadeTheMove)
                return true
            }
        }
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <strong>BIENVENIDO {username}</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        {
                            renderRow(0, 3)
                        }
                    </div>
                    <div className="row">
                        {
                            renderRow(3, 6)
                        }
                    </div>
                    <div className="row">
                        {
                            renderRow(6, 9)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Totito;