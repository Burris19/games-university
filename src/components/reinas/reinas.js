import React, { useEffect, useState } from "react"
import {
    useHistory,
    useLocation
} from "react-router-dom";

import { Cells } from './cells';

import { _showAlert } from '../helper/helper';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const Reinas = () => {
    let history = useHistory();
    let query = useQuery();

    const [age, setAge] = useState(19);
    const [queens, setQueens] = useState(0);
    const [username, setUsername] = useState('');
    const [cells, setCells] = useState([]);
    const [htmlCells, setHtmlCells] = useState([])

    useEffect(() => {
        console.log('The new value for age is =>', age)
    }, [age])

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
        setCells(Cells());
    }, [])

    useEffect(() => {
        const htmlCells = cells.map((cell, index) => (
            < div className="col" key={index} style={{ paddingBottom: "5px" }} >
                <a href="/" onClick={(e) => handlerClick(e, cell.column, cell.row, cell.isBlock, cell.number)}>
                    <img src={cell.image} alt={cell.name} width="100%" height="100%" />
                </a>
            </div >
        ));

        setHtmlCells(htmlCells)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cells])

    useEffect(() => {
        if (queens === 8) {
            const message = `Fin del juebo, Felicidades ${username} HAS GANADO`;
            _showAlert(message, 'ok')
                .then(() => {
                    history.push('/')
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queens])

    const renderRow = (start, end) => {
        return htmlCells.slice(start, end);
    }

    const handlerClick = async (e, column, row, isBlock, number) => {
        setAge((age + 10))

        e.preventDefault()
        if (!isBlock) {
            for (let x = 0; x < 8; x++) {
                const index = cells.findIndex((element) => element.column === column && element.row === x);
                cells[index]['isBlock'] = true;
                cells[index]['image'] = '/images/equis.png';
            }
            for (let x = 0; x < 8; x++) {
                const index = cells.findIndex((element) => element.row === row && element.column === x);
                cells[index]['isBlock'] = true;
                cells[index]['image'] = '/images/equis.png';
            }

            let copyRow = parseInt(JSON.stringify(row));
            let copyColumn = parseInt(JSON.stringify(column));

            for (let x = (copyColumn + 1); x < 8; x++) {
                copyRow = copyRow + 1;
                if (copyRow >= 8) {
                    break;
                }
                const index = cells.findIndex((element) => element.row === copyRow && element.column === x);
                cells[index]['isBlock'] = true;
                cells[index]['image'] = '/images/equis.png';
            }


            let copyRow1 = parseInt(JSON.stringify(row));
            let copyColumn1 = parseInt(JSON.stringify(column));
            for (let x = (copyColumn1 - 1); x >= 0; x--) {
                copyRow1 = copyRow1 - 1;
                if (copyRow1 < 0) {
                    break;
                }
                const index = cells.findIndex((element) => element.row === copyRow1 && element.column === x);
                cells[index]['isBlock'] = true;
                cells[index]['image'] = '/images/equis.png';
            }



            let copyRow2 = parseInt(JSON.stringify(row));
            let copyColumn2 = parseInt(JSON.stringify(column));

            for (let x = (copyColumn2 + 1); x < 8; x++) {
                copyRow2 = copyRow2 - 1;
                if (copyRow2 < 0) {
                    break;
                }
                const index = cells.findIndex((element) => element.row === copyRow2 && element.column === x);
                cells[index]['isBlock'] = true;
                cells[index]['image'] = '/images/equis.png';
            }



            let copyRow3 = parseInt(JSON.stringify(row));
            let copyColumn3 = parseInt(JSON.stringify(column));
            for (let x = (copyColumn3 - 1); x >= 0; x--) {
                copyRow3 = copyRow3 + 1;
                if (copyRow3 >= 8) {
                    break;
                }
                const index = cells.findIndex((element) => element.row === copyRow3 && element.column === x);
                cells[index]['isBlock'] = true;
                cells[index]['image'] = '/images/equis.png';
            }

            const index = cells.findIndex((element) => element.column === column && element.row === row);
            cells[index]['image'] = '/images/reina.jpg';
            setCells([
                ...cells
            ]);
            setQueens(queens + 1);
        }
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <strong>BIENVENIDO {username} {age}</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        {
                            renderRow(0, 8)
                        }
                    </div>
                    <div className="row">
                        {
                            renderRow(8, 16)
                        }
                    </div>
                    <div className="row">
                        {
                            renderRow(16, 24)
                        }
                    </div>
                    <div className="row">
                        {
                            renderRow(24, 32)
                        }
                    </div>
                    <div className="row">
                        {
                            renderRow(32, 40)
                        }
                    </div>
                    <div className="row">
                        {
                            renderRow(40, 48)
                        }
                    </div>
                    <div className="row">
                        {
                            renderRow(48, 56)
                        }
                    </div>
                    <div className="row">
                        {
                            renderRow(56, 64)
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Reinas