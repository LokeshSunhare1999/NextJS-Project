import React from 'react';
import styled from 'styled-components';
import ICONS from '../../../assets/icons';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { USER_TYPE_CUSTOMER } from '../../../constants';
import PropTypes from 'prop-types';

const Img = styled.img`
  width: ${(props) => props?.$width};
  height: ${(props) => props?.$height};
  cursor: pointer;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  cursor: ${(props) => (props.$isUnderLine ? 'pointer' : '')};
  &:hover {
    text-decoration-line: ${(props) => (props.$isUnderLine ? 'underline' : '')};
  }
`;

const IdBox = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const IdContainer = ({
  item,
  rowsIndex,
  header,
  isUnderLine = false,
  setUserType = () => {},
  tableData = [],
  customProps,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleIdClick = (e, item) => {
    setUserType(tableData[rowsIndex]?.userType);
    e.stopPropagation();
    let clickId = header?.split(' ').join('')?.toLowerCase();
    switch (clickId) {
      case 'orderid':
        navigate(
          `/orders/${item}?userType=${/*tableData[rowsIndex]?.userType*/ USER_TYPE_CUSTOMER}`, // TODO: Hard coded value for userType
        );
        break;
      case 'courseid':
        navigate(`/courses/${item}`);
        break;
      case 'testid':
        navigate(`/tests/${item}`);
        break;
      case 'candidateid':
      case 'customerid':
        navigate(`/customers/${item}`);
        break;
      case 'refundid':
        navigate(
          `/refund/${item}?userType=${USER_TYPE_CUSTOMER}`, // TODO: Fix paymentType from BE
        );
        break;
      case 'paymentid':
      case 'transactionid':
        navigate(
          `/payments/${item}?userType=${/*tableData[rowsIndex]?.userType*/ USER_TYPE_CUSTOMER}&paymentType=${customProps?.paymentType}`, // TODO: Fix paymentType from BE
        );
        break;
      case 'deviceid':
        navigate(`/devices/${item}`);
        break;
      case 'jobid':
        navigate(`/job/${item}?agencyType=${customProps?.agencyType}`);
    }
  };

  const handleCopyClick = (e, item) => {
    e.stopPropagation();

    navigator.clipboard
      .writeText(item)
      .then(() => {
        enqueueSnackbar('Copied to clipboard', {
          variant: 'success',
        });
        // Navigate to respective page
        // navigate(`/`);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleUnderline = (header, isUnderLine) => {
    let clickId = header?.split(' ').join('')?.toLowerCase();
    if (
      clickId === 'requestid' ||
      clickId === 'patxnid' ||
      clickId === 'paorderid' ||
      clickId === 'parefundid'
    ) {
      return false;
    } else return isUnderLine;
  };

  if (item?.length >= 6) {
    const lastSixChars = item.slice(-6);
    const formattedID = `XXXX${lastSixChars}`;
    return (
      <IdBox>
        <P
          $color={'#606C85'}
          $fontSize={'14px'}
          $fontWeight={'400'}
          $lineHeight={'normal'}
          $isUnderLine={handleUnderline(header, isUnderLine)}
          onClick={(e) => handleIdClick(e, item)}
        >
          {formattedID}
        </P>
        <Img
          src={ICONS.COPY}
          alt="copy"
          $width="14px"
          $height="14px"
          onClick={(e) => handleCopyClick(e, item)}
        />
      </IdBox>
    );
  } else if (!item) {
    return `-----`;
  } else {
    return item;
  }
};
IdContainer.propTypes = {
  item: PropTypes.string,
  rowsIndex: PropTypes.number,
  header: PropTypes.string,
  isUnderLine: PropTypes.bool,
  setUserType: PropTypes.func,
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      userType: PropTypes.string.isRequired,
    }),
  ),
  customProps: PropTypes.shape({
    paymentType: PropTypes.string,
  }),
};

export default IdContainer;
