import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, PageHeader, Table, Space, Typography, Popconfirm } from 'antd';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';

import { useAppDispatch } from "store/store";
import { fetchCompanyDetails, deleteCompanyDetailsById } from 'store/actionCreators/companyAction';
import InsertCompanyChanges from "components/modals/InsertCompanyChanges";
import EditCompanyDetails from "components/modals/EditCompanyDetails";
import { selectCompanies } from "store/selectors";

interface DataType {
    key: string;
    detailsId: number;
    companyName: string;
    registerDate: string,
    address: string,
    phoneNumber: string;
    bankAccount: string;
    bankName: string;
    bankCode: string;
    companyINN: string;
    companyOKED: string;
    manager: string;
}

const CompanyDetails: React.FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const {companyDetails} = useSelector(selectCompanies);
    const [companyId, setCompanyId] = useState<number | null>(null);
    const [data, setData] = useState<DataType[]>([]);
    const [companyTitle, setCompanyTitle] = useState<string>('');
    const [open, setOpen] = useState<boolean>(false);
    const [openEditCompanyDetails, setOpenEditCompanyDetails] = useState<boolean>(false);
    const [companyDetailsId, setCompanyDetailsId] = useState<number | null>(null);
    

    useEffect(() => {      
        const companyId = Number(id);
        dispatch(fetchCompanyDetails({ companyId }))
    }, [open, openEditCompanyDetails])

    useEffect(() => {
        setCompanyId(Number(id));
        setCompanyTitle(companyDetails[companyDetails.length - 1]?.companyName);
        
        companyDetails?.map(details => {
            let date = moment(details.registerDate).format('DD.MM.YYYY');
            setData(prevState => [
                ...prevState,
                {
                    key: details.id.toString(),
                    detailsId: details.id,
                    companyName: details.companyName,
                    registerDate: date,
                    address: details.address,
                    phoneNumber: details.phoneNumber,
                    bankAccount: details.bankAccount,
                    bankName: details.bankName,
                    bankCode: details.bankCode,
                    companyINN: details.companyINN,
                    companyOKED: details.companyOKED,
                    manager: details.manager
                }
            ])
        })
    

        return () => {
            setData([]);
        }
    }, [companyDetails])


    const handleEditCompanyDetails = (e: React.MouseEvent<HTMLElement>) => {
        setCompanyDetailsId(Number(e.currentTarget.id));
        setOpenEditCompanyDetails(true);
    }

    const deleteHandler = (id:string) => {
        const companyDetailsId = Number(id);        
        dispatch(deleteCompanyDetailsById({ companyDetailsId }))
    }

    const columns: ColumnsType<DataType> = [
        {
            title: 'Дата',
            dataIndex: 'registerDate',
            key: 'registerDate',
            width: 80,
            fixed: 'left',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.registerDate}
                </Typography.Text>
            )
        },
        {
            title: 'Наименование',
            dataIndex: 'companyName',
            key: 'companyName',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.companyName}
                </Typography.Text>
            )
        },
        {
            title: 'Адрес',
            dataIndex: 'address',
            key: 'address',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.address}
                </Typography.Text>
            )
        },
        {
            title: 'Телефон',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.phoneNumber}
                </Typography.Text>
            )
        },
        {
            title: 'р/с',
            dataIndex: 'bankAccount',
            key: 'bankAccount',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.bankAccount}
                </Typography.Text>
            )
        },
        {
            title: 'Банк',
            dataIndex: 'bankName',
            key: 'bankName',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.bankName}
                </Typography.Text>
            )
        },
        {
            title: 'МФО',
            dataIndex: 'bankCode',
            key: 'bankCode',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.bankCode}
                </Typography.Text>
            )
        },
        {
            title: 'ИНН',
            dataIndex: 'companyINN',
            key: 'companyINN',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.companyINN}
                </Typography.Text>
            )
        },
        {
            title: 'ОКЭД',
            dataIndex: 'companyOKED',
            key: 'companyOKED',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.companyOKED}
                </Typography.Text>
            )
        },
        {
            title: 'Руководитель',
            dataIndex: 'manager',
            key: 'manager',
            render: (_, record) => (
                <Typography.Text style={{ fontSize: '12px' }}>
                    {record.manager}
                </Typography.Text>
            )
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <a id={record.key} onClick={handleEditCompanyDetails}>Ред.</a>
                        <Popconfirm title="Вы уверенны, что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => deleteHandler(record.key)} >
                            <a >Удалить</a>
                        </Popconfirm>
                    </Space>
                )
            }
        },
    ]


    return (
        <div>
            <PageHeader
                ghost={false}
                title={companyTitle}
                subTitle="Реквизиты"
                extra={[
                    <Button key="1" type="primary" onClick={() => setOpen(true)}>
                        Внести изменения
                    </Button>
                ]}
            >
            </PageHeader>


            <Table
                dataSource={data}
                columns={columns}
                size="small"
                bordered
                scroll={{
                    x: "max-content"
                }}
            />

            <InsertCompanyChanges open={open} setOpen={setOpen} companyId={companyId} />
            <EditCompanyDetails open={openEditCompanyDetails} setOpen={setOpenEditCompanyDetails} id={companyDetailsId} />
        </div>
    );
};

export default CompanyDetails;