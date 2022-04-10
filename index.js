import inquirer from "inquirer";
import chalk from "chalk";

import fs from "fs";

function operation() {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "O que você gostaria de fazer no Accounts?",
        choices: [
            "Criar uma conta",
            "Consultar saldo",
            "Depositar",
            "Transferir",
            "Sacar",
            "Sair"
        ]
    }]).then((answer)  => {
        const action = answer.action;

        console.info(chalk.green(`Você escolheu ${action}`));

        switch (action) {
            case "Criar uma conta":
                createAccount();
                break;
            case "Consultar saldo":
                consultBalance();
                break;
            case "Depositar":
                deposit();
                break;
            case "Transferir":
                transfer();
                break;
            case "Sacar":
                withdraw();
                break;
            case "Sair":
                console.info(chalk.bgBlue.black("Obrigado por utilizar o Banco Accounts!"));
                process.exit();
                break;

        }
    }).catch((err) => {
        console.info(err);
    })
}

function createAccount(){
    console.info(chalk.green("Parabéns por escolher o Banco Accounts!"));
    buildAccount();
};

function buildAccount(){
    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?"
    }]).then(answer => {
        const accountName = answer.accountName;
        const account = {
            name: accountName,
            accountNumber: Math.floor(Math.random() * 10000),
            balance: 0
        };

        if(!fs.existsSync('./accounts')){
            fs.mkdirSync('./accounts');
        };

        if(fs.existsSync(`./accounts/${accountName}.json`)){
            console.info(chalk.bgRed.black(`Já existe uma conta com o nome ${accountName}, escolha outro nome para sua conta.`));
            buildAccount();
            return
        } else {
            fs.writeFile(`./accounts/${accountName}.json`, JSON.stringify(account), (err) => {
                if (err) throw err;
                console.info(chalk.green(`Conta ${accountName} criada com sucesso!`));
                console.info(chalk.green(`Número da conta: ${account.accountNumber}`));
                operation();
                return
            });
        }
    });  
}

function consultBalance(){
    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?"
    }]).then(answer => {
        const accountName = answer.accountName;
        if(!fs.existsSync(`./accounts/${accountName}.json`)){
            console.info(chalk.bgRed.black(`Conta não encontrada.`));
            operation();
            return
        }
        const account = JSON.parse(fs.readFileSync(`./accounts/${accountName}.json`));
        console.info(chalk.green(`Saldo da conta ${accountName}: ${account.balance.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`));
        operation();
        return;
    });
}

function deposit(){
    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?"
    }, {
        name: "value",
        message: "Qual o valor que você quer depositar?"
    }]).then(answer => {
        const accountName = answer.accountName;
        const value = parseFloat(answer.value);
        if(!fs.existsSync(`./accounts/${accountName}.json`)){
            console.info(chalk.bgRed.black(`Conta não encontrada.`));
            operation();
            return
        }
        const account = JSON.parse(fs.readFileSync(`./accounts/${accountName}.json`));
        account.balance += value;
        fs.writeFile(`./accounts/${accountName}.json`, JSON.stringify(account), (err) => {
            if (err) throw err;
            console.info(chalk.green(`Depósito realizado com sucesso!`));
            console.info(chalk.green(`Saldo atual: ${account.balance.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`));
            operation();
            return
        });
    });
};

function transfer(){
    inquirer.prompt([{
            name: "originAccount",
            message: "Qual o nome da sua conta de origem?"
        }, {
            name: "destinationAccount",
            message: "Qual o nome da sua conta de destino?"
        }, {
            name: "value",
            message: "Qual o valor que você quer transferir?"
        }
    ]).then(answer => {
        const originAccount = answer.originAccount;
        const destinationAccount = answer.destinationAccount;
        const value = parseFloat(answer.value);

        if(!fs.existsSync(`./accounts/${originAccount}.json`)){
            console.info(chalk.bgRed.black(`Conta de origem não encontrada.`));
            operation();
            return
        }
        const originAccountData = JSON.parse(fs.readFileSync(`./accounts/${originAccount}.json`));

        if(!fs.existsSync(`./accounts/${destinationAccount}.json`)){
            console.info(chalk.bgRed.black(`Conta de destino não encontrada.`));
            operation();
            return
        }
        const destinationAccountData = JSON.parse(fs.readFileSync(`./accounts/${destinationAccount}.json`));


        if(originAccountData.balance < value){
            console.info(chalk.bgRed.black(`Saldo insuficiente para transferência!`));
            operation();
            return
        } else {
            originAccountData.balance -= value;
            destinationAccountData.balance += value;
            fs.writeFile(`./accounts/${originAccount}.json`, JSON.stringify(originAccountData), (err) => {
                if (err) throw err;
                fs.writeFile(`./accounts/${destinationAccount}.json`, JSON.stringify(destinationAccountData), (err) => {
                    if (err) throw err;
                    console.info(chalk.green(`Transferência realizada com sucesso!`));
                    console.info(chalk.green(`Saldo atual: ${originAccountData.balance.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`));
                    operation();
                    return
                });
            });
        }
    })
}

function withdraw(){
    inquirer.prompt([{
        name: "accountName",
        message: "Qual o nome da sua conta?"
    }, {
        name: "value",
        message: "Qual o valor que você quer sacar?"
    }]).then(answer => {
        const accountName = answer.accountName;
        const value = parseFloat(answer.value);
        if(!fs.existsSync(`./accounts/${accountName}.json`)){
            console.info(chalk.bgRed.black(`Conta não encontrada.`));
            operation();
            return
        }
        const account = JSON.parse(fs.readFileSync(`./accounts/${accountName}.json`));

        if(account.balance < value){
            console.info(chalk.bgRed.black(`Saldo insuficiente para saque!`));
            operation();
            return
        } else {
            account.balance -= value;
            fs.writeFile(`./accounts/${accountName}.json`, JSON.stringify(account), (err) => {
                if (err) throw err;
                console.info(chalk.green(`Saque realizado com sucesso!`));
                console.info(chalk.green(`Saldo atual: ${account.balance.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`));
                operation();
                return
            });
        }
    });
}


operation();