pragma solidity ^0.4.0;
contract ReducePayloadTest
{
    struct Data_
    {
        uint256 para1And2FloatQuanti; //   参数1和2的量化， 原值 0~1之间小数，取前4位        
        uint256 para3And6FloatQuanti; //   参数3和6的量化 ， 原值都是 1~2，存储时对原值 /2
        uint256 para5FloatQuanti; //   参数5的量化 ，  原值 0~1
        address para4Address;
    }
    
    // 变量实例化 
    Data_   _data;

    // 测试用的，观察数据
    event EventShowData_ForTest( 
        address addrCurrentSender,
        uint256 para1And2, uint256 para3And6, uint256 para256, address para4,
        uint256 para1,
        uint256 para2,
        uint256 para3,
        uint256 para5,
        uint256 para6
      );

    
    // 操作函数 
    // 入参说明： para1And2Float 是 float 变量合体，前一半是para1量化，后一半是para2量化。para3And6Float与此相同。
    // 入参 para1And2Float 取值0~1，取小数点后4位。量化算法：*10000取整
    // 入参 para3And6Float 取值1~2，量化时外部除以2，再取小数点后4位。
    // 入参 para5Float 取值0~1，取小数点后4位。
    // 入参 para4Add 是地址类型。
    function set( uint256 para1And2Float, 
            uint256 para3And6Float, 
            uint256 para5Float,
            address para4Add
            ) public
    {
        _data = Data_(
            para1And2Float, 
            para3And6Float, 
            para5Float, 
            para4Add );
    }
    // 该函数是 set 函数的默认体。无需传参。全部用0.节约gas。
    function setDefault( ) public
    {
        _data = Data_(
            0, 
            0, 
            0, 
            msg.sender );
    }
    
    // 读取数据
    function get() public view returns (
        uint256 para1And2Float, 
        uint256 para3And6Float, 
        uint256 para5Float,
        address para4Add
        )
    {
        para1And2Float = _data.para1And2FloatQuanti;
        para3And6Float = _data.para3And6FloatQuanti;
        para5Float = _data.para5FloatQuanti;
        para4Add = _data.para4Address;        
    }

    // 测试用的输出数据到事件
    function outputToEvent_ForTest() public{
        emit EventShowData_ForTest( 
            msg.sender,
            _data.para1And2FloatQuanti,
            _data.para3And6FloatQuanti,
            _data.para5FloatQuanti,
            _data.para4Address,

            _data.para1And2FloatQuanti >> 128,
            _data.para1And2FloatQuanti & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF,

            _data.para3And6FloatQuanti >> 128,
            _data.para5FloatQuanti,            
            _data.para3And6FloatQuanti & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
         );
    }
}
