import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, PageHeader, Table, Space, Typography, Popconfirm, Grid, Divider } from 'antd';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { ColumnsType } from 'antd/es/table';

import { useAppDispatch } from "store/store";
import { fetchCompanyDetails, deleteCompanyDetailsById } from 'store/actionCreators/companyAction';
import CreateCompanyDetails from "components/modals/CreateCompanyDetails";
import EditCompanyDetails from "components/modals/EditCompanyDetails";
import { selectAuth, selectCompanies } from "store/selectors";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

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
  description: string;
}

const CompanyDetails: React.FC = () => {
  const { id } = useParams();
  const { sm, md } = useBreakpoint();
  const dispatch = useAppDispatch();
  const { sub } = useSelector(selectAuth);
  const { companyDetails } = useSelector(selectCompanies);
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

    companyDetails?.map((details: any) => {
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
          manager: details.manager,
          description: 'blabla'
        }
      ])
    })


    return () => {
      setData([]);
    }
  }, [companyDetails])


  const editHandler = (e: React.MouseEvent<HTMLElement>) => {
    setCompanyDetailsId(Number(e.currentTarget.id));
    setOpenEditCompanyDetails(true);
  }

  const deleteHandler = (id: string) => {
    const companyDetailsId = Number(id);
    dispatch(deleteCompanyDetailsById({ companyDetailsId, sub }))
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Дата',
      dataIndex: 'registerDate',
      key: 'registerDate',
      width: 80,
      fixed: 'left',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.registerDate}
        </Text>
      )
    },
    {
      title: '',
      dataIndex: 'mobile',
      key: 'mobile',
      responsive: ["xs"],
      render: (_, record) => {
        return (
          <React.Fragment>
            <div style={{padding: '5px 0'}}>
              <Space direction="vertical" size="large">
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ fontSize: '14px' }}>{record.registerDate}</Text>
                  <Text style={{ fontSize: '14px' }}>{record.companyName}</Text>
                </div>
                <Space size="middle">
                  <a id={record.key} onClick={editHandler}>Редактировать</a>
                  <Popconfirm title="Вы уверенны, что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => deleteHandler(record.key)} >
                    <a >Удалить</a>
                  </Popconfirm>
                </Space>
              </Space>
            </div>
          </React.Fragment>
        )
      }
    },
    {
      title: 'Наименование',
      dataIndex: 'companyName',
      key: 'companyName',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.companyName}
        </Text>
      )
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.address}
        </Text>
      )
    },
    {
      title: 'Телефон',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.phoneNumber}
        </Text>
      )
    },
    {
      title: 'р/с',
      dataIndex: 'bankAccount',
      key: 'bankAccount',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.bankAccount}
        </Text>
      )
    },
    {
      title: 'Банк',
      dataIndex: 'bankName',
      key: 'bankName',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.bankName}
        </Text>
      )
    },
    {
      title: 'МФО',
      dataIndex: 'bankCode',
      key: 'bankCode',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.bankCode}
        </Text>
      )
    },
    {
      title: 'ИНН',
      dataIndex: 'companyINN',
      key: 'companyINN',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.companyINN}
        </Text>
      )
    },
    {
      title: 'ОКЭД',
      dataIndex: 'companyOKED',
      key: 'companyOKED',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.companyOKED}
        </Text>
      )
    },
    {
      title: 'Руководитель',
      dataIndex: 'manager',
      key: 'manager',
      responsive: ["sm"],
      render: (_, record) => (
        <Text style={{ fontSize: '12px' }}>
          {record.manager}
        </Text>
      )
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      align: 'center',
      fixed: 'right',
      responsive: ["sm"],
      render: (_, record) => {
        return (
          <Space size="middle">
              <a id={record.key} onClick={editHandler} style={{ marginRight: '20px' }}><FormOutlined style={{ fontSize: '22px' }} /></a>
              <Popconfirm title="Вы уверенны, что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => deleteHandler(record.key)} >
                <a ><DeleteOutlined style={{ fontSize: '22px' }} /></a>
              </Popconfirm>
          </Space>
        )
      }
    },
  ]


  return (
    <div>
      {md ? (
        <PageHeader
          ghost={false}
          title={companyTitle}
          subTitle="Реквизиты"
          // onBack={() => window.history.back()}
          style={{ fontSize: '12px' }}
          extra={[
            <Button key="1" type="primary" onClick={() => setOpen(true)}>
              Внести изменения
            </Button>
          ]}
        >
        </PageHeader>
      ) : (
        <>
          <Space direction="vertical">
            <Title level={5}>{companyTitle}</Title>
            <Text type="secondary" >Реквизиты</Text>
          </Space>
          <Divider/>
            <Button size="large" block type="primary" onClick={() => setOpen(true)}>
              Внести изменения
            </Button>
          <Divider />
        </>
      )
      }

      <Table
        dataSource={data}
        columns={columns}
        size="small"
        bordered
        scroll={sm ? { x: "max-content" } : {}}
        expandable={{
          showExpandColumn: sm ? false : true,
          expandedRowRender: record => <div style={{ margin: 0 }}>
            <React.Fragment>
              <div style={{ padding: '20px 10px' }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong style={{ fontSize: '12px' }}>Адрес:</Text>
                <Text>{record.address}</Text>
                <Text strong style={{ fontSize: '12px' }}>Телефон:</Text>
                <Text >{record.phoneNumber}</Text>
                <Text strong style={{ fontSize: '12px' }}>р/с:</Text>
                <Text >{record.bankAccount}</Text>
                <Text strong style={{ fontSize: '12px' }}>Банк:</Text>
                <Text >{record.bankName}</Text>
                <Text strong style={{ fontSize: '12px' }}>МФО:</Text>
                <Text >{record.bankCode}</Text>
                <Text strong style={{ fontSize: '12px' }}>ИНН:</Text>
                <Text >{record.companyINN}</Text>
                <Text strong style={{ fontSize: '12px' }}>ОКЭД:</Text>
                <Text >{record.companyOKED}</Text>
                <Text strong style={{ fontSize: '12px' }}>Руководитель:</Text>
                <Text >{record.manager}</Text>
                </Space>
              </div>
            </React.Fragment>
          </div>,
        }}
      />

      <CreateCompanyDetails open={open} setOpen={setOpen} companyId={companyId} />
      <EditCompanyDetails open={openEditCompanyDetails} setOpen={setOpenEditCompanyDetails} id={companyDetailsId} />
    </div >
  );
};

export default CompanyDetails;