import React, { useEffect, useState } from 'react';
import { Select, Form } from 'antd';
import axios from "axios";
import { API_URL } from "consts/consts";

const { Option } = Select;

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetchProfessions = (value: string, callback: (foundData: { value: string; text: string }[]) => void) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const search = async () => {
    axios.get(API_URL + "/profession", { params: { value } })
      .then((response: any) => {
        const { data } = response;
        if (currentValue === value) {
          const foundData = data.map((item: any) => ({
            value: item.profession,
            text: item.profession
          }));
          callback(foundData);
        }

      })

  };

  timeout = setTimeout(search, 1000);

}

type PositionSearchInputProps = {
  position: string;
  setPosition: React.Dispatch<React.SetStateAction<any>>
}

const PositionSearchInput: React.FC<PositionSearchInputProps> = ({ position, setPosition }) => {
  const [data, setData] = useState<any[]>([]);
  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (position !== '') {
      setValue(position);
    }
  }, [position])

  const handleSearch = (newValue: string) => {
    if (newValue) {
      fetchProfessions(newValue, setData);
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setPosition(newValue);
  };

  const options = data.map((item, index) => <Option key={index} value={item.value}>{item.text}</Option>);

  return (
    
      <Select
        showSearch
        value={value}
        placeholder="Выбрать должность"
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        allowClear
      >
        {options}
      </Select>
    
  );
};

export default PositionSearchInput;