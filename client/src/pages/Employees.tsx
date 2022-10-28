import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Input, PageHeader, Table, Space, Popconfirm, Tooltip, notification, Grid, Typography } from 'antd';
import type { ColumnsType, TableProps, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import type { InputRef } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

import { useAppDispatch } from "store/store";
import CreateEmployee from 'components/modals/CreateEmployee';
import { fetchEmployees, deleteEmployeeById } from 'store/actionCreators/employeeAction';
import EditEmployee from 'components/modals/EditEmployee';
import { selectCompanies, selectEmployees, selectAuth } from "store/selectors";
import { Employee } from "../store/types";

const { useBreakpoint } = Grid;
const { Text } = Typography;

interface DataType {
  key: string;
  indexNum: number;
  employeeName: string;
  personalId: string;
  employeeMobile?: string;
}

type DataIndex = keyof DataType;


const Employees: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { sm, md, lg, xl, xxl } = useBreakpoint();
  const { sub } = useSelector(selectAuth);
  const { currentCompany } = useSelector(selectCompanies);
  const { companies } = useSelector(selectCompanies);
  const { employees } = useSelector(selectEmployees);
  const [openCreateEmployee, setOpenCreateEmployee] = useState(false);
  const [openEditEmployee, setOpenEditEmployee] = useState(false);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [data, setData] = useState<DataType[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);


  useEffect(() => {
    if (currentCompany) {
      const id = currentCompany.id;
      dispatch(fetchEmployees({ id }));
    } else {
      setData([]);
    }
  }, [sub, currentCompany, openCreateEmployee, openEditEmployee, companies])

  useEffect(() => {
    employees?.map((employee: Employee, index: number) => {
      setData(prevState => [
        ...prevState,
        {
          key: employee.id.toString(),
          indexNum: index + 1,
          employeeName: `${employee.employeeFamilyName} ${employee.employeeFirstName} ${employee.employeePatronymic}`,
          personalId: employee.personalId,
          employeeMobile: `${employee.employeeFamilyName} ${employee.employeeFirstName} ${employee.employeePatronymic} ${employee.personalId}`
        }
      ])
    })

    return () => {
      setData([]);
    }
  }, [employees])


  const editHandler = (e: React.MouseEvent<HTMLElement>) => {
    setEmployeeId(Number(e.currentTarget.id));
    setOpenEditEmployee(true);
  }

  const deleteHandler = (id: string) => {
    const employeeId = Number(id);
    dispatch(deleteEmployeeById(employeeId))
      .then((response: any) => {
        if (response.error?.message === 'Rejected') {
          notification.error({
            message: `Невозможно удалить физ.лицо!`,
            description:
              'Существуют связанные документы.',
            placement: 'top',
          });
        }
      })
  }

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Поиск
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Очистить
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              clearFilters && handleReset(clearFilters)
              setSearchText('');
              confirm({ closeDropdown: true });
              setSearchedColumn(dataIndex);
            }}
          >
            Сбросить
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const columns: ColumnsType<DataType> = [
    {
      title: '№ п/п',
      dataIndex: 'indexNum',
      key: 'indexNum',
      width: '5%',
      responsive: ["sm"]
    },
    {
      title: "ФИО",
      dataIndex: 'employeeMobile',
      key: 'employeeMobile',
      responsive: ["xs"],
      ...getColumnSearchProps('employeeMobile'),
      render: (_, record) => {
        return (
          <React.Fragment>
            <Space direction="vertical" size="middle">
              <Text strong>{record.employeeName}</Text>
              <Space>ПИНДФЛ:{record.personalId}</Space>
              
              <Space size="large">
                <Space size="middle">
                  <a id={record.key} onClick={editHandler}>Редактировать</a>
                  <Popconfirm title="Вы уверенны, что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => deleteHandler(record.key)} >
                    <a >Удалить</a>
                  </Popconfirm>
                </Space>
              </Space>
            </Space>
          </React.Fragment>
        )
      }
    },
    {
      title: 'ФИО',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: '30%',
      ...getColumnSearchProps('employeeName'),
      responsive: ["xl"]
    },
    {
      title: 'ПИНДФЛ',
      dataIndex: 'personalId',
      key: 'personalId',
      width: '10%',
      ...getColumnSearchProps('personalId'),
      responsive: ["xl"]
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      responsive: ["xl"],
      render: (_, record) => {
        return (
          <Space size="middle">
            <a id={record.key} onClick={editHandler}>Редактировать</a>
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
      {currentCompany ? (
        <PageHeader
          ghost={false}
          title="Физические лица"
          // subTitle="This is a subtitle"
          extra={[
            <Button key="1" type="primary" onClick={() => setOpenCreateEmployee(true)}
            >
              Добавить
            </Button>
          ]}
        >

        </PageHeader>
      ) : (
        <PageHeader
          ghost={false}
          title="Физические лица"
          // subTitle="This is a subtitle"
          extra={[
            <Tooltip key="1" title="Сначала создайте организацию">
              <Button key="1" type="primary" onClick={() => setOpenCreateEmployee(true)}
                disabled
              >
                Добавить
              </Button>
            </Tooltip>

          ]}
        >

        </PageHeader>
      )}


      <Table
        rowKey={(record) => record.key}
        dataSource={data}
        columns={columns}
        size={sm ? "small" : "large"}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '15', '25'], position: ['topRight'], size: 'default' }}
      />

      <CreateEmployee open={openCreateEmployee} setOpen={setOpenCreateEmployee} />
      <EditEmployee open={openEditEmployee} setOpen={setOpenEditEmployee} id={employeeId} />
    </div>
  );
};

export default Employees;