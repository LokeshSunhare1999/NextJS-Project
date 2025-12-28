import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import ActionButton from './ActionButton';
import { RUPEE_SYMBOL } from '../constants/details';
import { zIndexValues } from '../style';
import DocumentStatus from './customerDetails/DocumentStatus';
import { useLocation } from 'react-router-dom';
import IdContainer from './atom/tableComponents/IdContainer';
import CustomTooltip from './common/CustomTooltip';
import { camelToSnakeUpperCase, formatDate, pluralize } from '../utils/helper';
import { Rating } from '@mui/material';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import usePermission from '../hooks/usePermission';
import InfoBlock from './common/InfoBlock';
import { agencyType } from '../constants/employer';
import { shortenVideoLink } from '../utils/helper';
import { SHORTENED_LENGTH } from '../constants';
import ReferralAmountInfo from './common/ReferralAmountInfo';
import InlineIconText from './common/InlineIconText';
import { MAX_INTERVIEW_SCORE } from '../constants/jobs';

const ActionsPanel = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
`;

const StyledTableContainer = styled(TableContainer)`
  width: ${(props) =>
    props?.width
      ? props?.width + ' !important'
      : 'calc(100% - 55px) !important'};
  background-color: #fff;
  border: 1px solid #cdd4df;
  border-radius: 16px;
  padding: 5px;
  font-family: Poppins;
  overflow-x: scroll;
  z-index: ${zIndexValues.DISPLAY_TABLE};
`;

const HeaderRow = styled(TableRow)`
  & .MuiTableCell-root {
    background: #f4f6fa !important;
    margin: 5px 5px 0px 5px;
  }
`;

const HeaderCell = styled(TableCell)`
  font-family: Poppins !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  line-height: 21px !important;
  color: #46536c !important;
  border: none !important;
  border-top-right-radius: ${(props) => (props?.$isLast ? '16px' : '')};
  // min-width: 200px;
`;
const StyledLink = styled.div`
  text-decoration: underline;
  cursor: pointer;
  color: #0066cc;
`;
const FirstHeaderCell = styled(HeaderCell)`
  border-top-left-radius: 16px;
`;

const LastHeaderCell = styled(HeaderCell)`
  border-top-right-radius: 16px;
`;

const ContentCell = styled(HeaderCell)`
  background-color: ${(props) =>
    !props?.$highlightRow ? '#fff' : 'transparent !important'};
  color: #606c85 !important;
  border-bottom: ${(props) =>
    props?.$index + 1 < props?.$length ? '1px solid #cdd4df !important' : ''};
  // min-width: 200px;
  cursor: ${(props) => (props?.$cursor ? props.$cursor : 'pointer')};
`;

const Img = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;
const P = styled.p`
  color: #606c85;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const IdBox = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StatusBox = styled(IdBox)`
  display: flex;
  align-items: start;
  justify-content: start;
  background-color: #fff;
`;

const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: 8px;
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

const StyledDiv = styled.div`
  display: ${(props) => props.$display || 'flex'};
  flex-direction: ${(props) => props.$flexDirection || 'row'};
  width: ${(props) => props.$width || 'auto'};
  align-items: center;
  justify-content: ${(props) => props.$justifyContent || 'center'};
  gap: ${(props) => props.$gap || '10px'};
  background-color: ${(props) => props.$backgroundColor || 'transparent'};
`;

const DateTooltipWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const StyledWrap = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledCount = styled.div`
  font-weight: 600;
  font-size: 10px;
  color: #ffa600;
`;

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px; /* Adjust spacing between items */
`;

const Wrap = styled.span`
  font-size: 14px;
  color: ${(props) => props.color || '#000'}; /* Default color */
  font-weight: ${(props) => props.fontWeight || 'normal'};
`;

const DisplayTable = ({
  tableId,
  rows,
  headers,
  headersType,
  showActionsPanel = false,
  onClickFn,
  tableWidth,
  onDelete,
  arrBtn,
  actionIndex,
  setActionIndex,
  actionOpen,
  setActionOpen,
  setUserType,
  tableData = [],
  customProps,
  tooltipIcon,
  toolTipArray = [],
  highlightRow = false,
  emptyDataMessage = 'No data available',
  arrBtnRight,
  isActionBottom = false,
  statusRemarks = [],
  lastAlignRight = false,
  permission,
  navigate,
}) => {
  const location = useLocation();
  const [actionTop, setActionTop] = useState(0);
  const { hasPermission } = usePermission();
  const progressStatusMap = {
    COMPLETED: 'Completed',
    IN_PROGRESS: 'In Progress',
    NOT_STARTED: 'Yet To Start',
  };

  const handleContentConfig = (item, index, rowsIndex) => {
    if (
      item === null ||
      item === undefined ||
      item === '' ||
      item?.length === 0
    )
      return '-----';

    switch (headersType[index]) {
      case 'DATE_TIME':
        return formatDate(item, 'DD MMM YYYY, h:mm a');

      case 'DATE':
        return moment(item).isValid() ? (
          <DateTooltipWrapper>
            {formatDate(item, 'DD MMM YYYY')}
            {headers[index] === 'Posted on' ? (
              <CustomTooltip
                placement="right-end"
                title={`Expires on: ${customProps?.jobExpiryDate?.[rowsIndex] ? formatDate(customProps?.jobExpiryDate?.[rowsIndex], 'DD MMM YYYY') : null}`}
              >
                <Img
                  src={ICONS.INFO_ICON_GREY}
                  alt="Tooltip"
                  $width="16px"
                  $height="16px"
                />
              </CustomTooltip>
            ) : null}
          </DateTooltipWrapper>
        ) : (
          'Currently working'
        );

      case 'ID':
        return (
          <IdContainer
            item={item}
            rowsIndex={rowsIndex}
            header={headers[index]}
            isUnderLine={true}
            setUserType={setUserType}
            tableData={tableData}
            customProps={customProps || {}}
          />
        );
      case 'AGENCY':
        return agencyType[item] || '-----';

      case 'JOB_REEL_LINK': {
        const customerIndex = headers.findIndex(
          (header) => header === 'Customer ID',
        );
        const customerId = rows[rowsIndex][customerIndex];
        return (
          <StyledLink
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/customers/${customerId}?jobReel=0`);
            }}
          >
            JobReel.Link
          </StyledLink>
        );
      }
      case 'JOB_REEL_LIST': {
        return <StyledLink>JobReel.Link</StyledLink>;
      }

      case 'TOTAL_APPLICATION_LINK': {
        const jobIndex = headers.findIndex((header) => header === 'Job ID');
        const jobId = rows[rowsIndex][jobIndex];
        return item > 0 ? (
          <StyledWrap>
            <StyledLink
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/jobs/${jobId}/applications/`);
              }}
            >
              {item}
            </StyledLink>
            <StyledCount>
              {customProps?.yetToShortlistCount?.[rowsIndex]
                ? `(${customProps.yetToShortlistCount?.[rowsIndex]})`
                : null}
            </StyledCount>
          </StyledWrap>
        ) : (
          '0'
        );
      }
      case 'SHORTLISTED_APPLICATION_LINK': {
        const jobIndex = headers.findIndex((header) => header === 'Job ID');
        const jobId = rows[rowsIndex][jobIndex];
        return item > 0 ? (
          <StyledLink
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/jobs/${jobId}/applications?screeningStatus=SHORTLISTED`,
              );
            }}
          >
            {item}
          </StyledLink>
        ) : (
          '0'
        );
      }
      case 'INTERVIEWED_APPLICATION_LINK': {
        const jobIndex = headers.findIndex((header) => header === 'Job ID');
        const jobId = rows[rowsIndex][jobIndex];
        return item > 0 ? (
          <StyledLink
            onClick={(e) => {
              e.stopPropagation();
              navigate(
                `/jobs/${jobId}/applications?interviewStatus=INTERVIEW_COMPLETED`,
              );
            }}
          >
            {item}
          </StyledLink>
        ) : (
          '0'
        );
      }
      case 'FINALISED_APPLICATION_LINK': {
        const jobIndex = headers.findIndex((header) => header === 'Job ID');
        const jobId = rows[rowsIndex][jobIndex];
        return item > 0 ? (
          <StyledLink
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/jobs/${jobId}/applications?finalStatus=HIRED`);
            }}
          >
            {item}
          </StyledLink>
        ) : (
          '0'
        );
      }

      case 'VIDEO': {
        return (
          <StyledLink onClick={() => window?.open(item, '_blank')}>
            Link
          </StyledLink>
        );
      }

      case 'AMOUNT':
        return `${RUPEE_SYMBOL} ${item}`;

      case 'AMOUNT_INFO':
        return (
          <InfoBlock
            item={item}
            showTooltip={true}
            tooltipIcon={ICONS.INFO_ICON_GREY}
            statusRemark={statusRemarks[rowsIndex]}
          />
        );
      case 'REFERRAL_AMOUNT_INFO':
        return (
          <ReferralAmountInfo
            item={item}
            showTooltip={statusRemarks[rowsIndex]?.length > 0}
            tooltipIcon={ICONS.INFO_ICON_GREY}
            statusRemark={statusRemarks[rowsIndex]}
          />
        );
      case 'STATUS':
        return (
          <StatusBox>
            <P $fontSize={'14px'} $fontWeight={'400'} $lineHeight={'normal'}>
              {item
                ?.toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </P>
          </StatusBox>
        );

      case 'CAPITAL_STATUS':
        return (
          <DocumentStatus
            status={item}
            showTooltip={item !== 'VERIFIED'}
            tooltipIcon={ICONS.INFO_ICON_GREY}
            statusRemark={statusRemarks[rowsIndex]}
          />
        );
      case 'ORDER_STATUS':
      case 'DOCUMENT_VERIFICATION_TAG':
        return <DocumentStatus status={item} />;

      case 'EMPLOYER_CONTACT_DETAILS':
        return `${item?.dialCode} ${item?.phoneNo}`;

      case 'KYC_REMARKS':
        return `${item[item.length - 1]?.remark}`;

      case 'PRODUCT_ID':
        return <IdContainer item={item[0]?.productId} />;

      case 'COURSE_NAME':
        return `${item.title}`;

      case 'PROGRESS_STATUS':
        return progressStatusMap[item] || '-----';

      case 'PRIMARY_CONTACT':
        return `${item?.dialCode} ${item?.phoneNo}`;
      case 'RATING':
        return (
          <FlexContainer $alignItems="center">
            {item}
            <Rating
              name="unique-rating"
              value={item}
              precision={0.5}
              readOnly
            />
          </FlexContainer>
        );

      case 'ACHIEVEMENT_OBJECT':
        return (
          <StyledDiv $width={'100%'} $justifyContent={'flex-start'}>
            {item?.trophyCount >= 0 ? (
              <StyledDiv $flexDirection={'column'} $gap={'0'}>
                <Img src={ICONS?.TROPHY} />
                {`${item?.trophyCount} Trophy`}
              </StyledDiv>
            ) : null}

            {item?.badgeCount >= 0 ? (
              <StyledDiv $flexDirection={'column'} $gap={'0'}>
                <Img src={ICONS?.BADGE} />
                {`${item?.badgeCount} Badge${pluralize(item?.badgeCount, '', 's')}`}
              </StyledDiv>
            ) : null}

            {item?.medalType === 'NONE' ? (
              <StyledDiv $flexDirection={'column'} $gap={'0'}>
                -----
              </StyledDiv>
            ) : null}

            {item?.medalType === 'GOLD' ? (
              <StyledDiv $flexDirection={'column'} $gap={'0'}>
                <StyledDiv $flexDirection={'column'} $gap={'0'}>
                  <Img src={ICONS?.GOLD_MEDAL} />
                  {`Gold Medal`}
                </StyledDiv>
              </StyledDiv>
            ) : null}

            {item?.medalType === 'SILVER' ? (
              <StyledDiv $flexDirection={'column'} $gap={'0'}>
                <StyledDiv $flexDirection={'column'} $gap={'0'}>
                  <Img src={ICONS?.SILVER_MEDAL} />
                  {`Silver Medal`}
                </StyledDiv>
              </StyledDiv>
            ) : null}

            {item?.medalType === 'BRONZE' ? (
              <StyledDiv $flexDirection={'column'} $gap={'0'}>
                <StyledDiv $flexDirection={'column'} $gap={'0'}>
                  <Img src={ICONS?.BRONZE_MEDAL} />
                  {`Bronze Medal`}
                </StyledDiv>
              </StyledDiv>
            ) : null}
          </StyledDiv>
        );

      case 'BADGE':
        return item === 'NONE' ? '-----' : <Img src={ICONS?.BADGE} />;

      case 'COMMA_SEPARATED_TEXT':
        return item?.join(', ');

      case 'UPLOADED_FILE':
        return (
          <InlineIconText
            icon={ICONS.THUMBNAIL_GRAY}
            text={camelToSnakeUpperCase(item)}
          />
        );

      case 'TRUNCATE_TEXT': {
        const trimmed = item?.toString()?.trim();
        return trimmed?.length > 12 ? `${trimmed?.slice(0, 12)}...` : trimmed;
      }

      case 'REFERRAL_LINK':
        return (
          <StyledLink onClick={() => window.open(item, '_blank')}>
            Referral Link
          </StyledLink>
        );
      case 'QR_IMAGE_LINK':
        return (
          <StyledLink onClick={() => window.open(item, '_blank')}>
            QR Code Image
          </StyledLink>
        );
      case 'INTERVIEW_SCORE':
        return (
          <StyledWrapper>
            <Wrap color="#32B237">{item}</Wrap>
            <span>/</span>
            <Wrap color="#A0A7B6">{MAX_INTERVIEW_SCORE}</Wrap>
          </StyledWrapper>
        );
      default:
        return <span title={item}>{item}</span>;
    }
  };

  const handleTableRowClick = (index) => {
    {
      if (typeof onClickFn === 'function') onClickFn(index);
    }
  };

  const handleActionClick = (e, index) => {
    const table = document.querySelector(`#${tableId}`);
    const action = document.querySelector(`#action-${tableId}-${index}`);
    const tableTop = table.getBoundingClientRect();
    const actionTop = action.getBoundingClientRect();
    const tableDistanceFromTop = tableTop.top;
    const actionDistanceFromTop = actionTop.top;
    const arrBtnLen = isActionBottom ? arrBtn?.length || 0 : 0;
    setActionTop(actionDistanceFromTop - tableDistanceFromTop - arrBtnLen * 40);
    e.stopPropagation();

    if (actionIndex === index) {
      setActionIndex('');
    } else {
      setActionIndex(index);
    }
    setActionOpen(true);
  };

  if (!rows || rows?.length === 0) {
    return (
      <StyledDiv>
        <P $fontSize={'16px'} $fontWeight={'500'} $lineHeight={'24px'}>
          {emptyDataMessage}
        </P>
      </StyledDiv>
    );
  }
  if (permission && !hasPermission(permission)) {
    return null;
  }

  return (
    <StyledTableContainer id={tableId} width={tableWidth}>
      <Table aria-label="simple table">
        <TableHead>
          <HeaderRow sx={{ verticalAlign: 'top' }}>
            <FirstHeaderCell>{headers[0]}</FirstHeaderCell>
            {headers
              .filter((item) => headers.indexOf(item) !== 0)
              .map((val, idx) => {
                return (
                  <HeaderCell
                    $isLast={!showActionsPanel && idx === headers.length - 2}
                    key={val}
                    align={
                      !showActionsPanel &&
                      idx === headers.length - 2 &&
                      lastAlignRight
                        ? 'right'
                        : 'left'
                    }
                  >
                    {val}
                  </HeaderCell>
                );
              })}
            {showActionsPanel && (
              <LastHeaderCell align="right">Action</LastHeaderCell>
            )}
          </HeaderRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={`${row[0]}-${index}`}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                verticalAlign: 'top',
                maxHeight: '200px',
                overflow: 'scroll',
                cursor: customProps?.cursor || 'pointer',
                '&:hover': {
                  backgroundColor: '#f4f6fa',
                },
              }}
              onClick={() => handleTableRowClick(index)}
            >
              {row.map((val, idx) => {
                return (
                  <ContentCell
                    key={idx}
                    index={index}
                    length={rows?.length}
                    $highlightRow={highlightRow}
                    align={
                      idx === row?.length - 1 && lastAlignRight
                        ? 'right'
                        : 'left'
                    }
                    $cursor={customProps?.cursor}
                  >
                    {handleContentConfig(val, idx, index)}
                  </ContentCell>
                );
              })}
              {showActionsPanel && (
                <ContentCell
                  align="right"
                  index={index}
                  length={rows?.length}
                  $highlightRow={highlightRow}
                >
                  <ActionsPanel>
                    {toolTipArray[index]?.length > 0 ? (
                      <CustomTooltip
                        placement="bottom-end"
                        title={toolTipArray[index]?.join(', ')}
                      >
                        <Img
                          src={tooltipIcon || ICONS.INFO_ICON}
                          alt="Tooltip"
                          $width="16px"
                          $height="16px"
                        />
                      </CustomTooltip>
                    ) : null}
                    <Img
                      id={`action-${tableId}-${index}`}
                      src={ICONS.THREE_DOTS}
                      alt="Three Dots"
                      $width="14px"
                      $height="14px"
                      onClick={(e) => handleActionClick(e, index)}
                    />
                    {actionIndex === index && actionOpen && (
                      <ActionButton
                        arrBtn={arrBtn}
                        actionOpen={actionOpen}
                        setActionOpen={setActionOpen}
                        isLast={index === rows?.length - 1}
                        top={`${actionTop}px`}
                        right={arrBtnRight || '30px'}
                      />
                    )}
                  </ActionsPanel>
                </ContentCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};
DisplayTable.propTypes = {
  tableId: PropTypes.string,
  rows: PropTypes.arrayOf(PropTypes.array),
  headers: PropTypes.arrayOf(PropTypes.string),
  headersType: PropTypes.arrayOf(PropTypes.string),
  showActionsPanel: PropTypes.bool,
  onClickFn: PropTypes.func,
  tableWidth: PropTypes.string,
  onDelete: PropTypes.func,
  arrBtn: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      icon: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
  actionIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setActionIndex: PropTypes.func,
  actionOpen: PropTypes.bool,
  setActionOpen: PropTypes.func,
  setUserType: PropTypes.func,
  tableData: PropTypes.array,
  customProps: PropTypes.object,
  tooltipIcon: PropTypes.string,
  toolTipArray: PropTypes.array,
  highlightRow: PropTypes.bool,
  emptyDataMessage: PropTypes.string,
  arrBtnRight: PropTypes.string,
  isActionBottom: PropTypes.bool,
  statusRemarks: PropTypes.array,
};

export default DisplayTable;
