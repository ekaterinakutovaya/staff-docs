import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, PageHeader, Table, Space, Tag, Popconfirm, Grid, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';


import CreateCompany from "components/modals/CreateCompany";
import { useAppDispatch } from "store/store";
import { fetchCompanies, setCurrentCompany, deleteCompanyById } from 'store/actionCreators/companyAction';
import { selectAuth, selectCompanies } from "store/selectors";
import { Company } from "../store/types";

const { useBreakpoint } = Grid;
const { Text } = Typography;

interface DataType {
  key: string;
  indexNum: number;
  companyName: string;
  current: boolean;
}

const Companies: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { md } = useBreakpoint();
  const [open, setOpen] = useState<boolean>(false);
  const { sub } = useSelector(selectAuth);
  const { companies } = useSelector(selectCompanies);
  const [data, setData] = useState<DataType[]>([]);


  useEffect(() => {
    dispatch(fetchCompanies({ sub }));
  }, [open, sub])

  useEffect(() => {
    companies?.map((company: Company, index: number) => {
      setData(prevState => [
        ...prevState,
        {
          key: company.id.toString(),
          indexNum: index + 1,
          companyName: company.companyName,
          current: company.isCurrent
        }
      ])
    })


    return () => {
      setData([]);
    }
  }, [companies])

  const changeCompanyHandler = (e: React.MouseEvent<HTMLElement>) => {
    const id = Number(e.currentTarget.id);
    dispatch(setCurrentCompany({ id, sub }));
  }

  const navigateToCompanyDetails= (e: React.MouseEvent<HTMLElement>) => {
    navigate(`/dashboard/company_details/${e.currentTarget.id}`, { replace: true });
  }

  const deleteHandler = (id: string) => {
    const companyId = Number(id);
    dispatch(deleteCompanyById({ companyId, sub }));
  }

  const columns: ColumnsType<DataType> = [

    {
      title: '??? ??/??',
      dataIndex: 'indexNum',
      key: 'indexNum',
      width: '5%',
      responsive: ["sm"]
    },
    {
      title: "",
      render: (_, record) => {
        if (record.current) {
          return (
            <React.Fragment>
              <Space direction="vertical" size="middle">
                <Text strong>{record.companyName}</Text>
                <Space size="large">
                  <a onClick={navigateToCompanyDetails} id={record.key}>??????????????????</a>
                  <Popconfirm title="???? ????????????????, ?????? ???????????? ?????????????? ?????????????" okText="????" cancelText="??????" onConfirm={() => deleteHandler(record.key)} >
                    <a >??????????????</a>
                  </Popconfirm>
                </Space>
                <Tag color='green'>
                  ??????????????
                </Tag>
              </Space>
            </React.Fragment>
          )
        } else {
          return (
            <React.Fragment>
              <Space direction="vertical" size="middle">
                <Text strong>{record.companyName}</Text>
                <Space size="large">
                  <a onClick={navigateToCompanyDetails} id={record.key}>??????????????????</a>
                  <Popconfirm title="???? ????????????????, ?????? ???????????? ?????????????? ?????????????" okText="????" cancelText="??????" onConfirm={() => deleteHandler(record.key)} >
                    <a >??????????????</a>
                  </Popconfirm>
                </Space>
                <Button type="dashed" size="small" id={record.key}
                  onClick={changeCompanyHandler}
                >???????????????????? ??????????????</Button>
              </Space>
            </React.Fragment>
          )
        }
      },
      responsive: ["xs"]
    },
    {
      title: '????????????????????????',
      dataIndex: 'companyName',
      key: 'companyName',
      width: '30%',
      responsive: ["sm"]
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (_, record) => {
        return (
          <Space size="middle">
            <a onClick={navigateToCompanyDetails} id={record.key}>??????????????????</a>
            <Popconfirm title="???? ????????????????, ?????? ???????????? ?????????????? ?????????????" okText="????" cancelText="??????" onConfirm={() => deleteHandler(record.key)} >
              <a >??????????????</a>
            </Popconfirm>
          </Space>
        )
      },
      responsive: ["sm"]
    },
    {
      title: '',
      dataIndex: 'tags',
      key: 'tags',
      width: '10%',
      render: (_, record) => {
        if (record.current) {
          return (
            <Tag color='green'>
              ??????????????
            </Tag>
          )
        }
        return (
          <Button type="dashed" size="small" id={record.key}
            onClick={changeCompanyHandler}
          >???????????????????? ??????????????</Button>
        )

      },
      responsive: ["sm"]
    },

  ]

  // const handleJobs = () => {
  //   axios.get(API_URL + "/profession/create")  
  // }


  return (
    <div>
      <PageHeader
        ghost={false}
        title="??????????????????????"
        extra={[
          <Button key="1" type="primary" onClick={() => setOpen(true)}
            // style={md ? { display: 'flex' } : { display: 'none' }}
          >
            ????????????????
          </Button>
        ]}
      >
        {/* <Button size="large" type="primary" onClick={() => setOpen(true)} block
          style={md ? { display: 'none' } : { display: 'block', marginBottom: '20px' }}
        >
          ????????????????
        </Button> */}
      </PageHeader>

      <Table
        dataSource={data}
        columns={columns}
        // showHeader={sm ? true : false}
      />

      {/* <Button onClick={handleJobs}>jobs</Button> */}

      <CreateCompany open={open} setOpen={setOpen} />
    </div>
  );
};

export default Companies;