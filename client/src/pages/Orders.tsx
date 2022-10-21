import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import { Button, PageHeader, Table, Dropdown, Menu, Space, Popconfirm, Tooltip, Input, DatePicker, notification } from 'antd';
import { DownOutlined, FileDoneOutlined } from '@ant-design/icons';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps,  } from 'antd/es/table/interface';

import type { InputRef, DatePickerProps } from 'antd';
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import moment from 'moment';

import { useAppDispatch } from "store/store";
import { selectCompanies, selectOrders, selectEmployees, selectSidebarItem } from "store/selectors";
import CreateEmploymentOrder from 'components/modals/CreateEmploymentOrder';
import CreateDismissalOrder from 'components/modals/CreateDismissalOrder';
import EditEmploymentOrder from 'components/modals/EditEmploymentOrder';
import { fetchOrders, deleteOrderById } from 'store/actionCreators/orderAction';
import { fetchCompanyDetails } from 'store/actionCreators/companyAction';
import { fetchContracts, deleteContractById, cancelDismissal } from 'store/actionCreators/contractAction';
import { fetchAdditionalAgreements, deleteAdditionalAgreementById } from 'store/actionCreators/additionalAgreementAction';
import { fetchEmployees, setEmployed } from 'store/actionCreators/employeeAction';
import contractService from "api/contract.service";
import exportToDocService from "api/exportToDoc.service";
import { orderTypes } from "consts/consts";
import EditDismissalOrder from 'components/modals/EditDismissalOrder';
import CreateStaffChanges from 'components/modals/CreateStaffChanges';
import EditStaffChanges from 'components/modals/EditStaffChanges';
import { Order, Employee } from "../store/types";
import employeeService from 'api/employee.service';

const { RangePicker } = DatePicker;
const dateFormat = 'DD.MM.YYYY';
// const weekFormat = 'MM/DD';
// const monthFormat = 'YYYY/MM';

const dateFormatList = ['DD.MM.YYYY', 'DD.MM.YY'];

const customFormat: DatePickerProps['format'] = value =>
    `custom format: ${value.format(dateFormat)}`;

// const customWeekStartEndFormat: DatePickerProps['format'] = value =>
//     `${moment(value).startOf('week').format(weekFormat)} ~ ${moment(value)
//         .endOf('week')
//         .format(weekFormat)}`;


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
}

type DataIndex = keyof DataType;

const Orders: React.FC = () => {
    const dispatch = useAppDispatch();
    const [openEmployment, setOpenEmployment] = useState(false);
    const [openDismissal, setOpenDismissal] = useState(false);
    const [openEditEmployment, setOpenEditEmployment] = useState(false);
    const [openEditDismissal, setOpenEditDismissal] = useState(false);
    const [openStaffChanges, setOpenStaffChanges] = useState(false);
    const [openEditStaffChanges, setOpenEditStaffChanges] = useState(false);
    const [editOrderId, setEditOrderId] = useState(null);
    const [editAgreementId, setEditAgreementId] = useState(null);
    const {currentCompany} = useSelector(selectCompanies);
    const { orders } = useSelector(selectOrders);
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
            label: (<Button type="text" onClick={() => setOpenEmployment(true)}>Прием на работу</Button>),
        },
        {
            key: '2',
            icon: <FileDoneOutlined />,
            label: (<Button type="text" onClick={() => setOpenStaffChanges(true)}>Кадровое перемещение</Button>),
        },
        {
            icon: <FileDoneOutlined />,
            key: '3',
            label: (<Button type="text" onClick={() => setOpenDismissal(true)}>Увольнение</Button>)
        }
    ]

    useEffect(() => {
        if (currentCompany) {
            const {id} = currentCompany;
            const companyId = id;
            dispatch(fetchCompanyDetails({companyId}));
            dispatch(fetchEmployees({ id }));
            dispatch(fetchContracts({ id }))
            dispatch(fetchAdditionalAgreements({ id }));
            dispatch(fetchOrders({ id }))
        }
    }, [openEmployment, openEditEmployment, openEditDismissal, openDismissal, selectedItem, currentCompany, openStaffChanges, openEditStaffChanges])

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
                    employeeId: order.employeeId
                }
            ])
        })

        return () => {
            setData([]);
        }
    }, [orders])

    const editHandler = (orderId: string, orderTypeId: number, agreementId:number) => {
        setEditOrderId(orderId);
        setEditAgreementId(agreementId);
        if (orderTypeId === 0) {
            setOpenEditEmployment(true);
        }
        if (orderTypeId === 1) {
            setOpenEditStaffChanges(true);
        }
        if (orderTypeId === 2) {
            setOpenEditDismissal(true);
        }
    }

    const deleteHandler = (orderId: string, orderTypeId: number, agreementId:number, employeeId:number) => {
        const { contractId } = orders.filter((order: Order) => order.id === Number(orderId))[0];

        if (orderTypeId === 0) {
            const joinedOrders = orders.filter((order: Order) => order.contractId === contractId);
            
            if (joinedOrders.length > 1) {
                notification.error({
                    message: `Невозможно удалить запись!`,
                    description:
                        'Существуют связанные документы.',
                    placement: 'top',
                });
            } else {
                dispatch(deleteOrderById({ orderId }))
                .then(() => {
                    dispatch(deleteContractById({ contractId }));
                })
            }
            
        }
        if (orderTypeId === 1) {
            const joinedOrders = orders.filter((order: Order) => order.contractId === contractId && order.orderTypeId === 1);
            
            if (joinedOrders.length > 1) {
                notification.error({
                    message: `Невозможно удалить запись!`,
                    description:
                        'Существуют связанные документы.',
                    placement: 'top',
                });
            } else {
                dispatch(deleteOrderById({ orderId }))
                .then(() => {
                    dispatch(deleteAdditionalAgreementById({ agreementId }));
                })
            }
            
        }
        if (orderTypeId === 2) {
            dispatch(deleteOrderById({ orderId }))
            dispatch(cancelDismissal({ contractId }))
            dispatch(setEmployed(employeeId))
        } 
    }

    const downloadOrder = (e: React.MouseEvent<HTMLElement>) => {
        const orderId = Number(e.currentTarget.id);

        exportToDocService.generateOrder(orderId)
            .then((response) => {
                const { fileName } = response.data;
                exportToDocService.downloadDocument(fileName); 
            })
    }

    const downloadDismissalOrder = (e: React.MouseEvent<HTMLElement>) => {
        const orderId = Number(e.currentTarget.id);

        exportToDocService.generateDismissalOrder(orderId)
            .then((response) => {
                const { fileName } = response.data;
                exportToDocService.downloadDocument(fileName);
            })
    }

    const downloadStaffChangesOrder = (e: React.MouseEvent<HTMLElement>) => {
        const orderId = Number(e.currentTarget.id);

        exportToDocService.generateStaffChangesOrder(orderId)
            .then((response) => {
                const { fileName } = response.data;
                exportToDocService.downloadDocument(fileName);
            })
    }

    const downloadContract = (e: React.MouseEvent<HTMLElement>) => {
        const contractId = Number(e.currentTarget.id);
        exportToDocService.generateContract(contractId)
            .then((response) => {
                const { fileName } = response.data;
                exportToDocService.downloadDocument(fileName);
            })
    }

    const downloadAdditionalAgreement = (e: React.MouseEvent<HTMLElement>) => {
        const agreementId = Number(e.currentTarget.id);
        exportToDocService.generateAdditionalAgreement(agreementId)
            .then((response) => {
                const { fileName } = response.data;
                exportToDocService.downloadDocument(fileName);
            })
    }

    const downloadContractCancellation = (e: React.MouseEvent<HTMLElement>) => {
        const contractId = Number(e.currentTarget.id);
        exportToDocService.generateContractCancellation(contractId)
            .then((response) => {
                const { fileName } = response.data;
                exportToDocService.downloadDocument(fileName);
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


    const getColumnDateSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{padding: 8, display: 'flex', flexDirection: 'column'}}>
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
        onFilter: (value:any, record) => {
            return (
                record[dataIndex] === value
            )
        }
    })

    const columns: ColumnsType<DataType> = [
        {
            title: '№ п/п',
            dataIndex: 'orderNo',
            key: 'orderNo'
        },
        {
            title: 'Дата',
            dataIndex: 'orderDate',
            key: 'orderDate',
            ...getColumnDateSearchProps('orderDate')
        },
        {
            title: 'Вид документа',
            dataIndex: 'orderType',
            key: 'orderType',
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
            ...getColumnSearchProps('employeeName'),
        },
        {
            title: 'Скачать',
            dataIndex: 'download',
            key: 'download',
            render: (_, record) => {
                if (record.orderTypeId === 0) {
                    return (
                        <Space size="middle">
                            <a id={record.key} onClick={downloadOrder}>Приказ</a>
                            <a id={record.contractId.toString()} onClick={downloadContract}>Договор</a>
                        </Space>
                    )
                } else if (record.orderTypeId === 1) {
                    return (
                        <Space size="middle">
                            <a id={record.key} onClick={downloadStaffChangesOrder}>Приказ</a>
                            <a id={record.agreementId.toString()} onClick={downloadAdditionalAgreement}>Доп.соглашение</a>
                        </Space>
                    )
                }
                else {
                    return (
                        <Space size="middle">
                            <a id={record.key} onClick={downloadDismissalOrder}>Приказ</a>
                            <a id={record.contractId.toString()} onClick={downloadContractCancellation}>Расторжение</a>
                        </Space>
                    )
                }

            }
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => {
                return (
                    <Space size="middle">
                        <a id={record.key} onClick={() => editHandler(record.key, record.orderTypeId, record.agreementId)}>Редактировать</a>
                        <Popconfirm title="Вы уверенны, что хотите удалить запись?" okText="Да" cancelText="Нет" onConfirm={() => deleteHandler(record.key, record.orderTypeId, record.agreementId, record.employeeId)} >
                            <a >Удалить</a>
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
            pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '15', '25'], position: ['topRight'], size: 'default' }}
            size="small"
            />

            <CreateEmploymentOrder open={openEmployment} setOpen={setOpenEmployment} />
            <CreateDismissalOrder open={openDismissal} setOpen={setOpenDismissal} />
            <EditEmploymentOrder open={openEditEmployment} setOpen={setOpenEditEmployment} orderId={editOrderId} />
            <EditDismissalOrder open={openEditDismissal} setOpen={setOpenEditDismissal} orderId={editOrderId} />

            <CreateStaffChanges open={openStaffChanges} setOpen={setOpenStaffChanges} />
            <EditStaffChanges open={openEditStaffChanges} setOpen={setOpenEditStaffChanges} orderId={editOrderId} agreementId={editAgreementId}/>
        </>
    );
};

export default Orders;