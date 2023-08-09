import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    InboxOutlined,
    DeleteOutlined,
    PlusOutlined, CloudUploadOutlined
} from "@ant-design/icons";
import ReactToPrint from 'react-to-print';
// import Pagination from "react-js-pagination";
import {
    Modal,
    Popconfirm,
    Col,
    Tooltip,
    Row,
    Tag,
    Upload,
    Input,
    Card,
    List,
    Button,
    Form,
    Select,
    Skeleton,
    Empty,
    Space,
    Avatar, Typography, Divider, Table, Spin, message
    // Pagination,
} from "antd";
import { Pagination } from "react-laravel-paginex";
import "antd/dist/antd.css";
import {currency, generateNo, getPropsUpload, handleOnError, rmComma} from "../helper";
import { deleteProduct, getProduct } from "../redux/actions/product.action";
import {productReducer} from "../redux/reducers/product.reducer";
import FormComponent from "./form";
// import FormComponent from "./form";
const { Title } = Typography;

const Search = Input.Search;
const { Option } = Select;
const { Dragger } = Upload;
const { Meta } = Card;

const dummyData = ["a", "a", "a", "a"];
const msgInput = "Tidak Boleh Kosong";
const Index = () => {
    const [showForm, setShowForm] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [idx, setIdx] = useState(undefined);
    const [refreshCart, setRefreshCart] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [page, setPage] = useState(1 );
    const [name, setName] = useState("");
    const [cart, setCart] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const dispatch = useDispatch();

    const resData = useSelector((state) => state.productReducer.data);
    const resLoading = useSelector((state) => state.productReducer.loadingGet);
    const resPagination = useSelector(
        (state) => state.productReducer.pagination
    );

    useEffect(() => {
        dispatch(getProduct(`?page=1`));
    }, []);

    const delay = (callback) => {
        clearTimeout(typingTimeout);
        const typing = setTimeout(() => {
            callback()
        }, 500);
        setTypingTimeout(typing);
    }

    const [typingTimeout, setTypingTimeout] = useState(0);

    const showTotal = (total) => `Total ${total} items`;

    const handleSearch=(val)=>{
        let where=`?page=${page}`;
        if(val!==''){
            where+=`&name=${val}`
        }
        delay(()=>{
            dispatch(getProduct(where));
        })
    }

    const handleAddToCart = (res,i)=>{
        Object.assign(res,{qty:res.qty||1});
        const newCart=cart;
        const cartExist = newCart.filter(v=>v.id===res.id);
        if(cartExist.length>0){
            Object.assign(res, {qty:res.qty+1})
        } else{
            newCart.push(res);
        }
        console.log(res);
        let newTotalAmount=0;
        newCart.map(v=>newTotalAmount+= v.qty*v.price)
        setTotalAmount(newTotalAmount)
        // newC
        // art.push(res);
        setCart(newCart)
        setRefreshCart([])
    }
    const [form] = Form.useForm();
    const handleSubmit=(e)=>{}
    const componentRef = useRef();


    return (
        <React.Fragment>
            <Row>
                <Col md={24} style={{backgroundColor:"#00ACEE",padding:"20px 20px 20px 50px"}}>
                    <img style={{height:"50px"}} src='https://alan.co.id/wp-content/uploads/2022/09/Logo-Alan-Creative-1536x360-1.png'/>
                </Col>
                <Col md={24} style={{padding:"20px 20px 20px 50px",boxShadow: '-1px 10px 5px 0px rgba(218,218,218,0.75)'}}>
                    <Button onClick={()=>setActiveTab(1)} style={{color:`${activeTab===1?'#00ACEE':'black'}`,borderBottom:`2px solid ${activeTab===1?'#00ACEE':'white'}`,borderTop:"none",borderLeft:"none",borderRight:"none",fontWeight:"bold"}}>Food</Button>
                    <Button onClick={()=>setActiveTab(2)} style={{color:`${activeTab===2?'#00ACEE':'black'}`,borderBottom:`2px solid ${activeTab===2?'#00ACEE':'white'}`,borderTop:"none",borderLeft:"none",borderRight:"none",fontWeight:"bold"}}>Transaksi</Button>
                </Col>
                {
                    activeTab===1&&<Col md={24} style={{padding:"20px 20px 20px 50px",backgroundColor:"#F8F8F8"}} >
                        <Typography.Paragraph style={{color:"#9F9F9F"}}>Tambahkan menu makanan yang ada di resto</Typography.Paragraph>

                        <Card title={<Button type="primary" onClick={() => setShowForm(true)}><PlusOutlined/> Tambah Menu</Button>} extra={
                            <Search
                                placeholder="Tulis sesuatu disini ..."
                                enterButton
                                onChange={(e)=>handleSearch(e.target.value)}
                                onSearch={(e) => handleSearch(e)}
                            />
                        }>
                            <Table
                                scroll={{x:'max-content',y:450}}
                                pagination={
                                    {
                                        showTotal:showTotal,
                                        showTitle:true,
                                        total:resPagination.total,
                                        pageSize:10,
                                        onChange:(page,pageSize)=>dispatch(getProduct(`?page=${page}`))
                                    }
                                }
                                loading={resLoading} dataSource={resData} columns={[
                                {title:"No",dataIndex:"no",key:"no",render:(val,rec,i)=>generateNo(i,resPagination.current_page,10)},
                                {title:"Nama",dataIndex:"name",key:"name"},
                                {title:"Foto",dataIndex:"image",key:"image",render:(val)=>{
                                        return <img onError={handleOnError} src={`http://localhost:8000/storage/${val}`} style={{height:"50px",width:"50px"}}/>
                                    }},
                                {title:"Harga",dataIndex:"price",key:"price",render:(val)=>"Rp. "+currency(val)},
                            ]}/>
                        </Card>
                    </Col>
                }


                {
                    activeTab===2&&<Col md={24} style={{padding:"20px 20px 20px 50px",backgroundColor:"#F8F8F8"}}>
                        <Row gutter={[12,12]}>
                            <Col md={16} >
                                <Row gutter={[10,10]}>
                                    {
                                        resData.map((res,i)=>{
                                            return  <Col md={8} key={i}>
                                                <Card
                                                    onClick={()=>{
                                                        handleAddToCart(res,i)
                                                    }}
                                                    hoverable
                                                    style={{
                                                        // height:"100px"
                                                        // width: 240,
                                                    }}
                                                    cover={<img style={{height:"130px"}} alt="example" src={`http://localhost:8000/storage/${res.image}`} onError={handleOnError} />}
                                                >
                                                    <Row>
                                                        <Col md={24} style={{textAlign:"center",width:"100%"}}>
                                                            {res.name}    <br/>
                                                            <span style={{color:"#00ACEE",fontWeight:"bold"}}>Rp. {currency(res.price)}</span>
                                                        </Col>
                                                    </Row>
                                                </Card>
                                            </Col>
                                        })
                                    }

                                </Row>
                            </Col>
                            <Col md={8}>
                                <Card>
                                    <Title level={5} style={{textAlign:"center"}}>
                                        <Avatar src={'https://static.vecteezy.com/system/resources/previews/019/896/008/original/male-user-avatar-icon-in-flat-design-style-person-signs-illustration-png.png'}/>
                                        &nbsp;Pesanan</Title>
                                    {
                                        cart.length>0?cart.map((res,i)=>{
                                            return   <Row justify={"space-between"} gutter={20} key={i} style={{marginBottom:"10px"}}>
                                                <Col>
                                                    <img src={`http://localhost:8000/storage/${res.image}`} onError={handleOnError} style={{height:"70px",width:"70px"}}/>
                                                    &nbsp;&nbsp;&nbsp;{res.name}
                                                </Col>
                                                <Col style={{alignItems:"center",display:"flex"}}>
                                                    <span style={{marginRight:"20px",color:"black"}}> x {res.qty}</span> <span style={{color:"#00ACEE",fontWeight:"bold"}}>Rp. {currency(res.price)}</span>
                                                </Col>
                                            </Row>
                                        }):<Empty description={''}/>
                                    }

                                    <Button style={{width:"100%",marginBottom:"10px"}} danger disabled={cart.length===0} onClick={()=>{
                                        setTotalAmount(0)
                                        setCart([])
                                    }}>Clear Cart</Button>
                                    <Row gutter={[20,20]}>
                                        <Col md={12}>
                                            <Button style={{width:"100%",backgroundColor:"#7CB083",border:"1px solid #7CB083",color:"white"}} disabled={cart.length===0} type={'default'}>Save Bill</Button>
                                        </Col>
                                        <Col md={12}>
                                            <ReactToPrint
                                                trigger={() =>  <Button style={{width:"100%",backgroundColor:"#7CB083",border:"1px solid #7CB083",color:"white"}} disabled={cart.length===0} type={'default'}>Print Bill</Button>}
                                                content={() => componentRef.current}
                                            />


                                        </Col>
                                    </Row>
                                    <Button style={{width:"100%",marginTop:"10px"}} type={'primary'} onClick={()=>setShowDetail(true)}  disabled={cart.length===0}>Change Rp. {currency(totalAmount)}</Button>
                                </Card>
                            </Col>
                        </Row>

                    </Col>
                }


            </Row>
            <div ref={componentRef} style={{padding:"50px"}}>
                {
                    cart.map((res,i)=>{
                        return  <Row justify={"space-between"} gutter={20} key={i} style={{marginBottom:"10px",borderBottom:"1px dashed #EEEEEE"}}>
                            <Col>
                                {res.name}
                            </Col>
                            <Col style={{alignItems:"center",display:"flex"}}>
                                <span style={{marginRight:"20px",color:"black"}}> x {res.qty}</span> <span>Rp. {currency(res.price)}</span>
                            </Col>

                        </Row>
                    })
                }
                <Row>
                    <Col md={24}>
                        <Title level={5} style={{textAlign:"right"}}>Total : {currency(totalAmount)}</Title>
                    </Col>
                </Row>
                {/*<Table pagination={false} dataSource={cart} columns={[*/}
                {/*    {title:"#",dataIndex:"id", render:(val,rec,i)=>i+1},*/}
                {/*    {title:"Nama",dataIndex:"name",key:"name"},*/}
                {/*    {title:"Harga",dataIndex:"price",key:"price",render:(val)=>"Rp. "+currency(val)},*/}
                {/*    {title:"Qty",dataIndex:"qty",key:"qty",render:(val)=>currency(val)},*/}
                {/*]}/>*/}
            </div>

            {
                <Modal
                    width={800}
                    centered
                    onCancel={()=>setShowDetail(false)}
                    title={<Title level={5}>Detail Pesanan</Title>}
                    visible={showDetail}
                    destroyOnClose={true}
                    maskClosable={false}
                    footer={null}
                >
                    <Row gutter={14}>
                        <Col md={16}>
                            <Table dataSource={cart} columns={[
                                {title:"#",dataIndex:"id", render:(val,rec,i)=>i+1},
                                {title:"Nama",dataIndex:"name",key:"name"},
                                {title:"Foto",dataIndex:"image",key:"image",render:(val)=>{
                                        return <img onError={handleOnError} src={`http://localhost:8000/storage/${val}`} style={{height:"50px",width:"50px"}}/>
                                    }},
                                {title:"Harga",dataIndex:"price",key:"price",render:(val)=>"Rp. "+currency(val)},
                            ]}/>
                        </Col>

                        <Col md={8}>
                            <Title level={5} style={{textAlign:"center"}}>Uang Pembeli</Title>
                            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                                <Form.Item
                                    hasFeedback
                                    name="price"
                                    label=""
                                    rules={[{ required: true,message:"Harga tidak boleh kosong" }]}
                                >
                                    <Input prefix={<span>Rp</span>} onChange={(e)=>{
                                        const val=e.target.value;
                                        form.setFieldsValue({ price: isNaN(rmComma(val))?0:currency(rmComma(val)) });
                                        setRefreshCart([])
                                    }}/>


                                </Form.Item>

                                <Row gutter={[14,14]}>
                                    <Col md={12}><Button style={{width:"100%"}} type={'default'}>Close</Button></Col>
                                    <Col md={12}><Button style={{width:"100%"}} type={'primary'} onClick={()=>{

                                        const price=Number(rmComma(form.getFieldValue('price')));
                                        if(price < totalAmount){
                                            message.info("jumlah uang tidak boleh kurang dari "+currency(totalAmount))
                                        }else{
                                            setCart([]);
                                            setShowDetail(false)
                                            setTotalAmount(0)
                                            form.setFieldsValue({ price: '0' });
                                        }
                                    }}>Pay</Button></Col>
                                </Row>

                                <br/>
                                <p style={{color:"#A05F6A"}}>Kembalian : {Number(rmComma(form.getFieldValue('price'))) > 0 && "Rp. "+currency(Number(rmComma(form.getFieldValue('price'))) - Number(totalAmount))}</p>


                            </Form>

                        </Col>
                    </Row>

                </Modal>
            }
            {showForm && (
                <FormComponent
                    isModal={showForm}
                    ok={() => {
                        dispatch(getProduct(`?page=1`));
                        setIdx(undefined);
                        setShowForm(false);
                        // handleUser(true);
                    }}
                    cancel={() => {
                        setIdx(undefined);
                        setShowForm(false);
                    }}
                    data={idx !== undefined ? resData[idx] : undefined}
                    where={`?page=1&perpage=${page}${name}`}
                />
            )}
        </React.Fragment>

    );
};

export default Index;
