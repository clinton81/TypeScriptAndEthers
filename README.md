# TypeScriptAndEthers
Test the interaction between typescript and smart contract.

# Important files:

Source file:
```
1. src/index.ts
2. src/ReduceTransactionPayload.sol
```



# Solving problem :

1. Smart contracts have no float type.
2. A float number can be quantize into an integer by multiplie by 1000, 10000, etc., expanded to an integer with sufficient precision, and then rounded.
3. Because each parameter is at least 32 bytes, two floats can be packed into one 32 byte , which can save code bytes and gas.
4. The packed one 32-bytes can also save more gas then two 32-bytes when write to chain.
5. In this example, do not use uint128 for storage. Although uint128 is enough to store a float data, because the parameter is uint256, direct assignment is more efficient and saves more GAS.
6. If you need to operate with float numbers inside the smart contract, you can refer to the event function written in the code to shift and get the real data. Then multiply again.
7. Complex floating-point logic is best executed off-chain.

思路：
1. 智能合约没有浮点数。
2. 浮点量化成整数，可以乘以一个1000、10000等，扩大到一个足够精度整数，再取整。
3. 因为每个参数都最少是32字节，因此将两个 float 量化后，合并成一个 32 字节，可以节约字节码，从而节约GAS。
4. 存储时也同样保存合并后的32字节。节约GAS。
5. 本例中，存储时不要用 uint128，虽然存储一个float量化数据用uint128就够，但是因为参数是uint256，直接赋值效率更高，也更节约GAS。
6. 如果需要在智能合约内部以浮点数操作，可以参照代码中写 Event 函数，把真实数据移位、取出来。然后再以倍数运算。
7. 复杂浮点逻辑最好在链外执行。
