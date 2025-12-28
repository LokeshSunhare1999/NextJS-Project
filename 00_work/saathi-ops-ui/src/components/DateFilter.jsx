import React from 'react';
import { DatePicker, Space } from 'antd';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import moment from 'moment';
import { COURSE_MODULE } from '../constants';
import PropTypes from 'prop-types';

const StyledDatePicker = styled(DatePicker)`
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #cdd4df;
  background: #fff;
  cursor: pointer;

  input::placeholder {
    color: ${(props) => props.$placeholderColor || '#bfbfbf'};
    font-size: ${(props) => props.$placeholderFontSize || '14px'};
  }

  .ant-picker-input input::placeholder {
    color: ${(props) => props.$placeholderColor || '#bfbfbf'} !important;
  }
`;

const Img = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;

const DateFilter = ({ fromDate, setFromDate, toDate, setToDate }) => {
  const disabledFromDate = (current) => {
    if (!toDate) {
      return current && current > moment().endOf('day');
    }
    return (
      current &&
      (current > toDate.startOf('day') ||
        current <
          toDate
            .startOf('day')
            .subtract(COURSE_MODULE?.DEFAULT_TIME_DIFF, 'days'))
    );
  };

  const disabledToDate = (current) => {
    const endOfToday = moment().endOf('day');
    if (!fromDate) {
      return current && current > endOfToday;
    }
    return (
      current && (current < fromDate.startOf('day') || current > endOfToday)
    );
  };

  return (
    <Space direction="vertical" size={12}>
      <Space size={20}>
        <StyledDatePicker
          value={fromDate}
          onChange={(date, dateString) => {
            setFromDate(date);
          }}
          disabledDate={disabledFromDate}
          placeholder="From Date"
          $placeholderColor="#606C8599"
          $placeholderFontSize="14px"
          suffixIcon={
            <Img
              src={ICONS.CALENDAR_ICON}
              $width={'16px'}
              $height={'16px'}
              alt="from-date"
            />
          }
        />
        <StyledDatePicker
          value={toDate}
          onChange={(date, dateString) => {
            setToDate(date);
          }}
          disabledDate={disabledToDate}
          placeholder="To Date"
          $placeholderColor="#606C8599"
          $placeholderFontSize="14px"
          suffixIcon={
            <Img
              src={ICONS.CALENDAR_ICON}
              $width={'16px'}
              $height={'16px'}
              alt="to-date"
            />
          }
        />
      </Space>
    </Space>
  );
};
DateFilter.propTypes = {
  fromDate: PropTypes.object,
  setFromDate: PropTypes.func.isRequired,
  toDate: PropTypes.object,
  setToDate: PropTypes.func.isRequired,
};

export default DateFilter;
