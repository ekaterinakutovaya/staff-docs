import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, PageHeader, Table, Space, Tag, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';


import CreateCompany from "components/modals/CreateCompany";
import { useAppDispatch } from "store/store";
import { fetchCompanies, setCurrentCompany, deleteCompanyById } from 'store/actionCreators/companyAction';
import { selectAuth, selectCompanies } from "store/selectors";


interface DataType {
    key: string;
    indexNum: number;
    companyName: string;
    current: boolean;
}

const Companies: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const { sub } = useSelector(selectAuth);
    const { companies } = useSelector(selectCompanies);
    const [data, setData] = useState<DataType[]>([]);  
      
    
    useEffect(() => {
        dispatch(fetchCompanies({sub}));
    }, [open, sub])

    useEffect(() => {
        companies?.map((company, index) => {
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
        dispatch(setCurrentCompany({id, sub}));
    }

    const navigateToEditPage = (e: React.MouseEvent<HTMLElement>) => {
        navigate(`/dashboard/company_details/${e.currentTarget.id}`, { replace: true });
    }

    const deleteHandler = (id:string) => {
        const companyId = Number(id);
        dispatch(deleteCompanyById({ companyId }))
    }

    const columns: ColumnsType<DataType> = [
        {
            title: '№ п/п',
            dataIndex: 'indexNum',
            key: 'indexNum',
            width: '5%'
        },
        {
            title: 'Наименование',
            dataIndex: 'companyName',
            key: 'companyName',
            width: '30%'
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            width: '10%',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <a onClick={navigateToEditPage} id={record.key}>Реквизиты</a>
                        <Popconfirm title="Вы уверенны, что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => deleteHandler(record.key)} >
                            <a >Удалить</a>
                        </Popconfirm>
                    </Space>
                )
            } 
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
                            Текущая
                        </Tag>
                    )
                }
                return (
                    <Button type="dashed" size="small" id={record.key} 
                    onClick={changeCompanyHandler}
                    >Установить текущей</Button>
                )

            }
        },

    ]


    return (
        <div>
            <PageHeader
                ghost={false}
                title="Организации"
                extra={[
                    <Button key="1" type="primary" onClick={() => setOpen(true)}>
                        Добавить
                    </Button>
                ]}
            >
               
            </PageHeader>

            <Table dataSource={data} columns={columns} size="small" />

            <CreateCompany open={open} setOpen={setOpen} />
        </div>
    );
};

export default Companies;