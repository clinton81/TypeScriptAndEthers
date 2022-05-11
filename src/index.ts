document.title = 'ReducePayload'

import * as ethers from 'ethers'


// 我的钱包私钥（测试用，非真实钱包）
let myPrivateKey = "758b9d77881da1c1e0c8e2093768ed720ab16babc6690601e3c06da047e44af7";
//// 连接器
//let provider = ethers.getDefaultProvider('ropsten');
// 连接到 Ganache
let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
// 事先部署好的合约地址
let contractAddr = "0x6168c1512e19662b00756d266645a4Aa3C64126E";

//合约abi
const strAbi: string = '[{"constant":false,"inputs":[],"name":"outputToEvent_ForTest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"para1And2Float","type":"uint256"},{"name":"para3And6Float","type":"uint256"},{"name":"para5Float","type":"uint256"},{"name":"para4Add","type":"address"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"setDefault","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addrCurrentSender","type":"address"},{"indexed":false,"name":"para1And2","type":"uint256"},{"indexed":false,"name":"para3And6","type":"uint256"},{"indexed":false,"name":"para256","type":"uint256"},{"indexed":false,"name":"para4","type":"address"},{"indexed":false,"name":"para1","type":"uint256"},{"indexed":false,"name":"para2","type":"uint256"},{"indexed":false,"name":"para3","type":"uint256"},{"indexed":false,"name":"para5","type":"uint256"},{"indexed":false,"name":"para6","type":"uint256"}],"name":"EventShowData_ForTest","type":"event"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"para1And2Float","type":"uint256"},{"name":"para3And6Float","type":"uint256"},{"name":"para5Float","type":"uint256"},{"name":"para4Add","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]';
const abi: any = JSON.parse(strAbi);

//主函数1
const setPara = async (
    contractAddr : string, // 合约地址

    para1Float: number, // 取值0~1，有效位 4 位小数
    para2Float: number, // 取值0~1，有效位 4 位小数
    para3Float: number, // 取值1~2，有效位 4 位小数
    para4Address: string, // 非0x地址
    para5Float: number, // 取值0~1，有效位 4 位小数
    para6Float: number, // 取值1~2，有效位 4 位小数
    ) => {
    //通过私钥模拟钱包登录
    let tempWallet = new ethers.Wallet(myPrivateKey, provider)
    var abiString = abi
    let contract = new ethers.Contract(contractAddr, abiString, tempWallet)

    ////查看合约中有哪些可调用的函数
    //console.log(contract.functions);

    //调用合约函数
    let func = contract.functions['set(uint256,uint256,uint256,address)'];
    console.log(func);

    // 构造参数
    let para1 = ethers.ethers.BigNumber.from(Math.floor(para1Float * 10000 + 0.5)); // +0.5是四舍五入
    let para2 = ethers.ethers.BigNumber.from(Math.floor(para2Float * 10000 + 0.5));
    let para3 = ethers.ethers.BigNumber.from(Math.floor(para3Float / 2 * 10000 + 0.5));
    let para5 = ethers.ethers.BigNumber.from(Math.floor(para5Float * 10000 + 0.5));
    let para6 = ethers.ethers.BigNumber.from(Math.floor(para6Float / 2 * 10000 + 0.5));
    
    let uint256Para1And2: ethers.BigNumber = para1.shl(128) // 左移128位（16字节）
    .or( para2 );

    let uint256Para3And6: ethers.BigNumber = para3.shl(128) // 左移128位（16字节）
        .or(para6);

    
    // 调用函数
    let data = await func( uint256Para1And2, uint256Para3And6, para5, para4Address );

    console.log(data);
}


//主函数2
const setParaDefault = async (
    contractAddr: string // 合约地址
) => {
    //通过私钥模拟钱包登录
    let tempWallet = new ethers.Wallet(myPrivateKey, provider)
    var abiString = abi
    let contract = new ethers.Contract(contractAddr, abiString, tempWallet)

    ////查看合约中有哪些可调用的函数
    //console.log(contract.functions);

    //调用合约函数
    let func = contract.functions['setDefault()'];
    console.log(func);
   

    // 调用函数
    let data = await func();

    console.log(data);
}

//主函数3
// 获取数据
const getPara = async (
    contractAddr: string // 合约地址
) => {
    //通过私钥模拟钱包登录
    let tempWallet = new ethers.Wallet(myPrivateKey, provider)
    var abiString = abi
    let contract = new ethers.Contract(contractAddr, abiString, tempWallet)

    ////查看合约中有哪些可调用的函数
    //console.log(contract.functions);

    //调用合约函数
    let func = contract.functions['get()'];
    console.log(func);


    // 调用函数
    let data = await func();

    console.log(data);

    // 转换原来函数返回的数据
    let para1 : number = (data[0].shr(128).toNumber() as number) / 10000;
    let para2 : number = (data[0].and("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF").toNumber() as number) / 10000;
    let para3 : number = (data[1].shr(128).toNumber() as number) * 2 / 10000;
    let para4 : string = data[3].toString();
    let para5 : number = (data[2].toNumber() as number) / 10000;
    let para6 : number = (data[1].and("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF").toNumber() as number) * 2 / 10000;
    console.log(para1, para2, para3, para4, para5, para6);

    return [para1, para2, para3, para4, para5, para6];
}




// 任意构造一些参数，测试合约
let x = setPara(contractAddr,
    0.555374, 0.666374, 1.777374,
    "0xf2a943C462A25831490B574203598635C7380368",
    0.111974, 1.333974
    );

// // 测试默认参数
// let x = setParaDefault( contractAddr );
// console.log( "x = ", x );

// 读取数据
let y = getPara( contractAddr );
console.log( "y = ", y );

