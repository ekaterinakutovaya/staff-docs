import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { Button, PageHeader, Table, Dropdown, Menu, Space, Popconfirm, Tooltip, Input, DatePicker, notification, Grid, Typography } from 'antd';
import { DownOutlined, FileDoneOutlined, FileWordOutlined, FormOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps, } from 'antd/es/table/interface';

import type { InputRef } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import { useAppDispatch } from "store/store";
import { selectCompanies, selectOrders, selectEmployees, selectSidebarItem, selectAuth, selectAdditionalAgreements } from "store/selectors";
import CreateEmploymentOrder from 'components/modals/CreateEmploymentOrder';
import CreateDismissalOrder from 'components/modals/CreateDismissalOrder';
import EditEmploymentOrder from 'components/modals/EditEmploymentOrder';
import { fetchOrders, deleteOrderById } from 'store/actionCreators/orderAction';
import { fetchCompanyDetails } from 'store/actionCreators/companyAction';
import { fetchContracts, deleteContractById, cancelDismissal } from 'store/actionCreators/contractAction';
import { fetchAdditionalAgreements, deleteAdditionalAgreementById } from 'store/actionCreators/additionalAgreementAction';
import { fetchEmployees, setEmployed } from 'store/actionCreators/employeeAction';
import exportToDocService from "api/exportToDoc.service";
import { orderTypes } from "consts/consts";
import EditDismissalOrder from 'components/modals/EditDismissalOrder';
import CreateEmployeeTransfer from 'components/modals/CreateEmployeeTransfer';
import EditEmployeeTransfer from 'components/modals/EditEmployeeTransfer';
import { Order, Employee, AdditionalAgreement } from "../store/types";

const { Text } = Typography;
const { useBreakpoint } = Grid;
const dateFormat = 'DD.MM.YYYY';


interface DataType {
  key: string;
  orderNo: number;
  orderDate: string;
  orderTypeId: number;
  orderType: string;
  employeeName?: string;
  contractId?: number;
  agreementId?: number;
  employeeId?: number;
  orderMobile?: string;
}

type DataIndex = keyof DataType;


const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sm } = useBreakpoint();
  const [openEmployment, setOpenEmployment] = useState(false);
  const [openDismissal, setOpenDismissal] = useState(false);
  const [openEditEmployment, setOpenEditEmployment] = useState(false);
  const [openEditDismissal, setOpenEditDismissal] = useState(false);
  const [openEmployeeTransfer, setOpenEmployeeTransfer] = useState(false);
  const [openEditEmployeeTransfer, setOpenEditEmployeeTransfer] = useState(false);
  const [editOrderId, setEditOrderId] = useState(null);
  const [editAgreementId, setEditAgreementId] = useState(null);
  const { sub } = useSelector(selectAuth);
  const { currentCompany, companyDetails } = useSelector(selectCompanies);
  const { orders } = useSelector(selectOrders);
  const { additionalAgreements } = useSelector(selectAdditionalAgreements);
  const { employees } = useSelector(selectEmployees);
  const { selectedItem } = useSelector(selectSidebarItem);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const menuItems = [
    {
      key: '1',
      icon: <FileDoneOutlined />,
      label: (<Button type="link" onClick={() => setOpenEmployment(true)}>Прием на работу</Button>),
    },
    {
      key: '2',
      icon: <FileDoneOutlined />,
      label: (<Button type="link" onClick={() => setOpenEmployeeTransfer(true)}>Кадровое перемещение</Button>),
    },
    {
      icon: <FileDoneOutlined />,
      key: '3',
      label: (<Button type="link" onClick={() => setOpenDismissal(true)}>Увольнение</Button>)
    }
  ]

  useEffect(() => {
    if (currentCompany) {
      const { id } = currentCompany;
      const companyId = id;
      dispatch(fetchCompanyDetails({ companyId }));
      dispatch(fetchEmployees({ id }));
      dispatch(fetchContracts({ id }))
      dispatch(fetchAdditionalAgreements({ id }));
      dispatch(fetchOrders({ id }))
    }
  }, [openEmployment, openEditEmployment, openEditDismissal, openDismissal, selectedItem, currentCompany, openEmployeeTransfer, openEditEmployeeTransfer])

  useEffect(() => {
    orders?.map((order: Order, index: number) => {
      const employee = employees.filter((emp: Employee) => emp.id === order.employeeId);
      let employeeFullName = '-';
      if (employee[0]) {
        const { employeeFamilyName, employeeFirstName, employeePatronymic } = employee[0];
        employeeFullName = `${employeeFamilyName} ${employeeFirstName} ${employeePatronymic}`
      }

      let date = moment(order.orderDate).format('DD.MM.YYYY');

      setData(prevState => [
        ...prevState,
        {
          key: order.id,
          orderNo: order.orderNo,
          orderDate: date,
          orderTypeId: order.orderTypeId,
          orderType: orderTypes[order.orderTypeId].label,
          employeeName: employeeFullName,
          contractId: order.contractId,
          agreementId: order.agreementId,
          employeeId: order.employeeId,
          orderMobile: `${order.orderNo} ${orderTypes[order.orderTypeId].label} ${employeeFullName} ${date}`
        }
      ])
    })

    return () => {
      setData([]);
    }
  }, [orders])

  const editHandler = (orderId: string, orderTypeId: number, agreementId: number) => {
    setEditOrderId(orderId);
    setEditAgreementId(agreementId);
    if (orderTypeId === 0) {
      setOpenEditEmployment(true);
    }
    if (orderTypeId === 1) {
      setOpenEditEmployeeTransfer(true);
    }
    if (orderTypeId === 2) {
      setOpenEditDismissal(true);
    }
  }

  const deleteHandler = (orderId: string, orderTypeId: number, agreementId: number, employeeId: number) => {
    const { contractId } = orders.filter((order: Order) => order.id === Number(orderId))[0];

    if (orderTypeId === 0) {
      const joinedAgreements = additionalAgreements.filter((agreement: AdditionalAgreement) => agreement.contractId === contractId);

      // We can delete the order and contract only if there is no additional agreements connected to the contract
      // If there is any connected additional agreements, prohibit deletion
      if (joinedAgreements.length > 0) {
        notification.error({
          message: `Невозможно удалить запись!`,
          description:
            'Существуют связанные документы.',
          placement: 'top',
        });
        return;
      }

      dispatch(deleteOrderById({ orderId, sub }))
        .then(() => {
          dispatch(deleteContractById({ contractId, sub }));
        })
    }

    if (orderTypeId === 1) {
      const joinedAgreements = additionalAgreements.filter((agreement: AdditionalAgreement) => agreement.contractId === contractId);

      // We can delete only the last agreement and if there is no dismissal order
      const isTheLastAgreement = joinedAgreements[joinedAgreements.length - 1].id === agreementId;
      const dismissalOrders = orders.filter((order: Order) => order.contractId === contractId && order.orderTypeId === 2);
      
      // If the agreement is not last, prohibit deletion
      if (!isTheLastAgreement) {
        notification.error({
          message: `Невозможно удалить запись!`,
          description:
            'Существуют связанные документы.',
          placement: 'top',
        });
        return;
      } else if (dismissalOrders.length > 0) { // If there is a dismissal order, prohibit deletion
        notification.error({
          message: `Невозможно удалить запись!`,
          description:
            'Существуют связанные документы.',
          placement: 'top',
        });
        return;
      }

      dispatch(deleteOrderById({ orderId, sub }))
        .then(() => {
          dispatch(deleteAdditionalAgreementById({ agreementId, sub }));
        })
    }

    if (orderTypeId === 2) {
      dispatch(deleteOrderById({ orderId, sub }))
      dispatch(cancelDismissal({ contractId }))
      dispatch(setEmployed(employeeId))
    }
  }

  const downloadHandler = (orderId: string, orderTypeId: number, agreementId: number, employeeId: number, contractId: number) => {

    if (!companyDetails.length) {
      notification.error({
        message: `Отсутствуют реквизиты организации!`,
        description:
          'Пожалуйста заполните реквизиты.',
        placement: 'top',
      });
      return;
    }
    
    switch (orderTypeId) {
      case 0:
        exportToDocService.generateOrder(Number(orderId))
          .then((response) => {
            const { fileName } = response.data;
            exportToDocService.downloadDocument(fileName);
          })
          .then(() => {
            exportToDocService.generateContract(contractId)
              .then((response) => {
                const { fileName } = response.data;
                exportToDocService.downloadDocument(fileName);
              })
          })
        break;
      case 1:
        exportToDocService.generateStaffChangesOrder(Number(orderId))
          .then((response) => {
            const { fileName } = response.data;
            exportToDocService.downloadDocument(fileName);
          })
          .then(() => {
            exportToDocService.generateAdditionalAgreement(agreementId)
              .then((response) => {
                const { fileName } = response.data;
                exportToDocService.downloadDocument(fileName);
              })
          })
        break;
      case 2:
        exportToDocService.generateDismissalOrder(Number(orderId))
          .then((response) => {
            const { fileName } = response.data;
            exportToDocService.downloadDocument(fileName);
          })
          .then(() => {
            exportToDocService.generateContractCancellation(contractId)
              .then((response) => {
                const { fileName } = response.data;
                exportToDocService.downloadDocument(fileName);
              })
          })
        break;
    }
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


  const getColumnDateSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column' }}>
        <DatePicker
          format={dateFormat}
          style={{ marginBottom: 8 }}
          onChange={e => setSelectedKeys([moment(e).format('DD.MM.YYYY')])}
          allowClear={true}
        />

        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as any, confirm, dataIndex)}
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
    onFilter: (value: any, record) => {
      return (
        record[dataIndex] === value
      )
    }
  })

  const columns: ColumnsType<DataType> = [
    {
      title: '№ п/п',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: '100px',
      ...getColumnSearchProps('orderNo'),
      responsive: ["md"]
    },
    {
      title: '',
      dataIndex: 'orderMobile',
      key: 'orderMobile',
      ...getColumnSearchProps('orderMobile'),
      responsive: ["xs"],
      render: (_, record) => {
        return (
          <div className="ordersTable">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>{record.orderType}</Text>
                <a id={record.key} onClick={() => downloadHandler(record.key, record.orderTypeId, record.agreementId, record.employeeId, record.contractId)} ><FileWordOutlined style={{ fontSize: '24px' }} /></a>
              </div>
              <Space size="small">
                <Text strong style={{ fontSize: '12px' }}>№ {record.orderNo} от </Text>
                <Text strong style={{ fontSize: '12px' }}>{record.orderDate}</Text>
              </Space>

              <Space>
                <Text>{record.employeeName}</Text>
              </Space>
              <Space size="large">
                <a id={record.key} onClick={() => editHandler(record.key, record.orderTypeId, record.agreementId)}>Редактировать</a>
                <Popconfirm title="Вы уверенны, что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => deleteHandler(record.key, record.orderTypeId, record.agreementId, record.employeeId)} >
                  <a >Удалить</a>
                </Popconfirm>
              </Space>
            </Space>
          </div>
        )
      }
    },
    {
      title: 'Дата',
      dataIndex: 'orderDate',
      key: 'orderDate',
      width: '130px',
      ...getColumnDateSearchProps('orderDate'),
      responsive: ["md"]
    },
    {
      title: 'Вид документа',
      dataIndex: 'orderType',
      key: 'orderType',
      width: '250px',
      responsive: ["md"],
      filters: [
        {
          text: 'Прием на работу',
          value: 'Прием на работу'
        },
        {
          text: 'Кадровое перемещение',
          value: 'Кадровое перемещение'
        },
        {
          text: 'Увольнение',
          value: 'Увольнение'
        },
      ],
      onFilter: (value: string, record) => record.orderType.indexOf(value) === 0,
    },
    {
      title: 'Работник',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: '30%',
      ...getColumnSearchProps('employeeName'),
      responsive: ["md"]
    },
    {
      title: 'Скачать',
      dataIndex: 'download',
      key: 'download',
      width: '120px',
      responsive: ["md"],
      // width: '10%',
      render: (_, record) => {
        return (
            <a id={record.key} onClick={() => downloadHandler(record.key, record.orderTypeId, record.agreementId, record.employeeId, record.contractId)} ><FileWordOutlined style={{ fontSize: '22px' }} /></a>
        )
      }
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: '200px',
      responsive: ["md"],
      render: (_, record) => {
        return (
          <Space size="middle">
              <a id={record.key} onClick={() => editHandler(record.key, record.orderTypeId, record.agreementId)} style={{ marginRight: '20px' }}><FormOutlined style={{fontSize: '22px'}}/></a>
            <Popconfirm title="Вы уверенны, что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => deleteHandler(record.key, record.orderTypeId, record.agreementId, record.employeeId)} >
                <a ><DeleteOutlined style={{ fontSize: '22px' }} /></a>
            </Popconfirm>

          </Space>
        )
      }
    },
  ]



  return (
    <>
      {currentCompany ? (
        <PageHeader
          ghost={false}
          title="Приказы"
          extra={[
            <Dropdown overlay={<Menu items={menuItems} />} key="1" trigger={['click']}>
              <Button type="primary">
                <Space>
                  Добавить
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          ]}
        >
        </PageHeader>
      ) : (
        <PageHeader
          ghost={false}
          title="Приказы"
          extra={[
            <Dropdown overlay={<Menu items={menuItems} />} key="1" trigger={['click']}>
              <Tooltip key="1" title="Сначала создайте организацию">
                <Button type="primary" disabled>
                  <Space>
                    Добавить
                    <DownOutlined />
                  </Space>
                </Button>
              </Tooltip>
            </Dropdown>
          ]}
        >
        </PageHeader>
      )}
      <Table
        dataSource={data}
        columns={columns}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '15', '25'], position: ['topRight'], size: 'default', total: orders.length }}
        size={sm ? "small" : "large"}
      />

      <CreateEmploymentOrder open={openEmployment} setOpen={setOpenEmployment} />
      <CreateDismissalOrder open={openDismissal} setOpen={setOpenDismissal} />
      <EditEmploymentOrder open={openEditEmployment} setOpen={setOpenEditEmployment} orderId={editOrderId} />
      <EditDismissalOrder open={openEditDismissal} setOpen={setOpenEditDismissal} orderId={editOrderId} />

      <CreateEmployeeTransfer open={openEmployeeTransfer} setOpen={setOpenEmployeeTransfer} />
      <EditEmployeeTransfer open={openEditEmployeeTransfer} setOpen={setOpenEditEmployeeTransfer} orderId={editOrderId} agreementId={editAgreementId} />
    </>
  );
};

export default Orders;