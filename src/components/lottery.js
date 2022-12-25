import lottery from "../lottery";
import web3 from "../web3";
import React, {useEffect, useState} from "react";
import * as _ from 'lodash'



export const LotteryContract = () => {
    const [players, setPlayers] = useState([]);
    const [manager, setManager] = useState('');
    const [balance, setBalance] = useState('');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');
    useEffect(() => {
        const fetchPlayers = async () => {
            const players = await lottery.methods.getPlayers().call();
            setPlayers(players);
        };
        fetchPlayers().catch(console.error);

    }, [players]);
    useEffect(() => {

        const fetchBalance = async () => {
            const balance = await web3.eth.getBalance(lottery.options.address);
            setBalance(balance);
        }

        fetchBalance().catch(console.error);
    }, [balance]);
    useEffect(() => {
        // web3.eth.getAccounts().then(console.log)
        const fetchManager = async () => {
            const manager = await lottery.methods.manager().call();
            setManager(manager);
        };
        fetchManager().catch(console.error);

    }, [manager]);


    const onSubmit = async (evt) => {
        evt.preventDefault();
        const accounts = await web3.eth.getAccounts();
        console.log(`${accounts} - ${value}`)
        setMessage('Waiting on transaction success...');
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(value, 'ether'),
        });
        setMessage('You have been entered!');

        //
    };
    const onClick = async (evt) => {
        evt.preventDefault();
        const accounts = await web3.eth.getAccounts();
        setMessage('Waiting on transaction success...');
        await lottery.methods.pickWinner().send({
            from: accounts[0],
        });
        setMessage('A winner has been picked!');
    };


    const uniquePlayers = _.uniq(players).length;
    return <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {manager}.
            <p>
                There {uniquePlayers == 1 ?
                `is currently ${uniquePlayers} person`:
                `are currently ${uniquePlayers} people`
            } entered and competing to
                win {web3.utils.fromWei(balance, 'ether')} ether!
            </p>
        </p>
        <hr/>
        <form onSubmit={onSubmit}>
            <h4>Want to try your luck? </h4>
            <div>
                <label>Amount of ether to enter</label>
                <input
                    value={value}
                    onChange={ev => setValue(ev.target.value)}
                />
            </div>
            <button>enter!</button>
        </form>
        <hr/>
        <h4>Ready to pick a winner?</h4>
        <button onClick={onClick}>Pick a winner!</button>
        <hr/>

        <h1>{message}</h1>
    </div>
};
