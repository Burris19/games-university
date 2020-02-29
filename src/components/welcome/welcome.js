import React, { useState } from "react"
import { useHistory } from "react-router-dom";

import './welcome.css';
import Form from "react-bootstrap/Form"

const Welcome = () => {
    let history = useHistory();
    const [url, setUrl] = useState('')
    const [validated, setValidated] = useState(false);
    const [username, SetUsername] = useState('');
    const _handlerChange = (e) => {
        const { value } = e.target;
        SetUsername(value)
    }

    const _handleSubmit = event => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
        } else {
            history.push(`${url}?username=${username}`)
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <strong>INTELIGENCIA ARTIFICIAL | MARIANO GALVEZ | FIN DE SEMANA</strong>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 div-logo">
                            <img src="/images/umg.png" className="card-img-top" alt="UMG" />
                        </div>
                        <div className="col-md-6">
                            <h1>TOTITO</h1>
                            <Form
                                noValidate
                                validated={validated}
                                onSubmit={_handleSubmit}>
                                <Form.Group>
                                    <label htmlFor="username">Nombre de usuario</label>
                                    <Form.Control
                                        placeholder="Ingrese un nombre de usuario"
                                        id="username"
                                        type="text"
                                        onChange={_handlerChange}
                                        value={username}
                                        name="username"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Ingrese un nombre de usuario para continuar.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <button type="submit" onClick={(e) => setUrl('/totito')} className="btn btn-primary" style={{ marginRight: "5px" }}>Ingresar al Totito</button>
                                <button type="submit" onClick={(e) => setUrl('/reinas')} className="btn btn-primary">Ingresar a las Reinas</button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Welcome;