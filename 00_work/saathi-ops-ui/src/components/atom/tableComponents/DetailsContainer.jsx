import React, { useContext } from 'react';
import styled from 'styled-components';
import ICONS from '../../../assets/icons';
import IdContainer from './IdContainer';
import { Rating, Stack } from '@mui/material';
import DocumentStatus from '../../customerDetails/DocumentStatus';
import { useLocation } from 'react-router-dom';
import { formatDate } from '../../../utils/helper';
import { RUPEE_SYMBOL } from '../../../constants/details';
import moment from 'moment-timezone';
import { ModalContext } from '../../../context/ModalProvider';
import IntroVideoModal from '../../customerDetails/IntroVideoModal';
import PropTypes from 'prop-types';
import { agencyType } from '../../../constants/employer';
import { MAX_INTERVIEW_SCORE } from '../../../constants/jobs';
import ImageContainer from '../../common/ImageContainer';

const CustomerWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  background: #fff;
  padding: 2px;
`;

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100%);
`;

const DetailsTop = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 40px);
  border-radius: 9px 9px 0px 0px;
  background: #f4f6fa;
  padding: 8px 20px;
`;

const DetailsBottom = styled.div`
  display: grid;
  width: calc(100% - 40px);
  grid-template-columns: ${(props) => (props?.$showGrid ? '1fr 1fr' : null)};
  row-gap: 12px;
  //   column-gap: 200px;
  padding: 10px 20px 13px 20px;
`;

const ContentWrap = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  width: ${(props) => props?.$width};
`;

const Img = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;

const ReviewDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ContentValue = styled.div`
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  max-width: ${(props) => props?.$maxWidth};
  width: 100%;
  word-break: break-word;
`;

const StyledLink = styled.div`
  text-decoration: underline;
  color: #3f7dff;
  cursor: pointer;
`;
const IdBox = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;
const IdNavigate = styled.div`
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
`;

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 4px; /* Adjust spacing between items */
`;

const Wrap = styled.span`
  font-size: 14px;
  color: ${(props) => props.color || '#000'}; /* Default color */
  font-weight: ${(props) => props.fontWeight || 'normal'};
`;

const DetailsContainer = (props) => {
  const {
    title,
    detailsData,
    showEdit = false,
    customProps,
    showTitle = true,
    showGrid = true,
    handleEditClick = () => {},
    setShowJobReelPage,
    navigate,
  } = props;
  const { displayModal } = useContext(ModalContext);
  const location = useLocation();
  const capitalizeKey = (key) => {
    if (key === 'paymentDateTime') return 'Payment Date/Time';
    if (key === 'GST Number') return 'GST Number';
    if (key === 'CIN') return 'CIN';
    if (key === 'LLPIN') return 'LLPIN';
    if (key === 'PAN') return 'PAN';
    if (key === 'AADHAAR') return 'AADHAAR';
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/([A-Z]) ([A-Z])/g, '$1$2')
      .replace(/([A-Za-z])(\d)/g, '$1 $2')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const openVideoPlayer = (e, videoLink, isMpd) => {
    e.stopPropagation();
    displayModal(<IntroVideoModal videoLink={videoLink} isMpd={isMpd} />, {
      modalWidth: '660px',
    });
  };
  const openThumbnailViewer = (e, imageLink) => {
    e.stopPropagation();
    displayModal(<ImageContainer images={imageLink} />);
  };

  const handleContentConfig = (item, type) => {
    const pageType = location.pathname.split('/')[1];
    const customerId = location.pathname.split('/')[2];

    if (
      item === null ||
      item === undefined ||
      item?.toString()?.includes('undefined') ||
      item?.toString()?.includes('null') ||
      item?.toString()?.length === 0
    )
      return '-----';

    switch (type) {
      case 'referredBy':
      case 'customerID':
        return (
          <IdContainer item={item} isUnderLine={true} header="customerid" />
        );

      case 'drivingLicenseNo':
        return item;
      case 'paymentID':
        return (
          <IdContainer
            item={item}
            isUnderLine={true}
            header="paymentid"
            customProps={customProps || {}}
          />
        );

      case 'orderID':
        return (
          <IdContainer
            item={item}
            isUnderLine={pageType !== 'orders'}
            header={pageType === 'orders' ? '' : 'orderid'}
          />
        );

      case 'courseID':
        return <IdContainer item={item} isUnderLine={true} header="courseid" />;
      case 'trueID':
        let url = import.meta.env.VITE_WEBAPP_URL;
        return (
          <IdNavigate
            onClick={() => {
              window.open(`${url}/trueid?customerId=${customerId}`, '_blank');
            }}
          >
            {item}
          </IdNavigate>
        );
      case 'businessCategory':
        if (item === 'DIRECT_EMPLOYER') return 'Employer';
        else if (item === 'RECRUITMENT_AGENCY') return 'Recruitment Agency';
        else if (item === 'FACILITY_MANAGEMENT') return 'Facility';
        else return 'Staffing';

      case 'referenceId':
      case 'refundID':
      case 'PA Txn ID':
        return <IdContainer item={item} isUnderLine={false} />;

      case 'orderDate':
        return formatDate(item, 'DD-MMM-YYYY, h:mm a');

      case 'paymentTime':
      case 'paymentDateTime':
      case 'refundTime':
        return formatDate(item, 'DD-MMM-YYYY, h:mm a');

      case 'employerVerificationStatus':
      case 'matchingStatus':
      case 'refundStatus':
      case 'paymentStatus':
      case 'userType':
      case 'customerType':
      case 'orderStatus':
      case 'hypervergeResponse':
        return <DocumentStatus status={item} />;

      case 'refundDate':
        return formatDate(item, 'DD-MMM-YYYY, h:mm a');

      case 'startDate':
        return formatDate(item, 'MMM YYYY');

      case 'endDate':
        return moment(item).isValid() ? formatDate(item, 'MMM YYYY') : item;

      case 'employerRating':
      case 'orderRating':
        return (
          <ReviewDiv>
            <P
              $color="#000000BF"
              $fontSize="14px"
              $fontWeight="400"
              $lineHeight="normal"
              $width={'auto'}
            >
              {item}
            </P>
            <Stack spacing={1} sx={{ marginTop: '-4px' }}>
              <Rating
                name="unique-rating"
                value={item}
                precision={0.5}
                readOnly
              />
            </Stack>
          </ReviewDiv>
        );

      case 'totalAmount':
        return `${RUPEE_SYMBOL} ${item}`;
      case 'paymentMethod':
        return `${item}`;

      case 'introVideo':
        return (
          <StyledLink onClick={(e) => openVideoPlayer(e, item)}>
            customer_intro_video.mp4
          </StyledLink>
        );
      case 'jobReel':
        return (
          <StyledLink
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/customers/${customerId}?jobReel`);
            }}
          >
            customer_reel_video.mp4
          </StyledLink>
        );
      case 'livePhotoUrl':
        return (
          <StyledLink onClick={() => window?.open(item, '_blank')}>
            customer_live_photo
          </StyledLink>
        );
      case 'jobDescription':
        return (
          <StyledLink onClick={() => window?.open(item, '_blank')}>
            JD Link
          </StyledLink>
        );

      case 'video': {
        if (item === '-----') return '-----';
        const fileExtension = item.slice(item.lastIndexOf('.'));
        return (
          <StyledLink onClick={(e) => openVideoPlayer(e, item, true)}>
            job_video
            {fileExtension}
          </StyledLink>
        );
      }
      case 'interviewVideoLink': {
        if (item === '-----') return '-----';
        const fileExtension = item.slice(item.lastIndexOf('.'));

        return (
          <StyledLink onClick={(e) => openVideoPlayer(e, item)}>
            interview video
            {fileExtension}
          </StyledLink>
        );
      }
      case 'biodataVideoLink': {
        if (item === '-----') return '-----';
        const fileExtension = item.slice(item.lastIndexOf('.'));
        return (
          <StyledLink onClick={(e) => openVideoPlayer(e, item)}>
            Biodata Video
            {fileExtension}
          </StyledLink>
        );
      }

      case 'interviewSheet': {
        const fileExtension = item.slice(item.lastIndexOf('.'));

        return (
          <StyledLink onClick={() => window?.open(item, '_blank')}>
            interview
            {fileExtension}
          </StyledLink>
        );
      }
      case 'promptSheet': {
        const fileExtension = item.slice(item.lastIndexOf('.'));

        return (
          <StyledLink onClick={() => window?.open(item, '_blank')}>
            prompt
            {fileExtension}
          </StyledLink>
        );
      }
      case 'thumbnail': {
        const fileExtension = item.slice(item.lastIndexOf('.'));
        const image = item;
        if (item === 'pending') {
          return <DocumentStatus status={item} />;
        } else
          return (
            <StyledLink onClick={(e) => openThumbnailViewer(e, [{ image }])}>
              thumbnail
              {fileExtension}
            </StyledLink>
          );
      }

      case 'Phone No.':
        if (item?.length >= 6)
          return (
            <IdBox>
              {item}
              <Img src={ICONS.VERIFIED} />
            </IdBox>
          );
        else return <IdBox>{item}</IdBox>;

      case 'emailId':
        if (detailsData?.activationStatus === 'ACTIVATED')
          return (
            <IdBox>
              {item}
              {item !== '-----' ? <Img src={ICONS.VERIFIED} /> : null}
            </IdBox>
          );
        else return <IdBox>{item}</IdBox>;

      case 'interviewScore':
        return (
          <StyledDiv>
            <Wrap color="#32B237">{item}</Wrap>
            <span>/</span>
            <Wrap color="#A0A7B6">{MAX_INTERVIEW_SCORE}</Wrap>
          </StyledDiv>
        );

      default:
        return item;
    }
  };

  return (
    <CustomerWrap>
      {showTitle ? (
        <DetailsTop>
          <Details>
            <P
              $color={'#000'}
              $fontSize={'16px'}
              $fontWeight={'600'}
              $lineHeight={'normal'}
              $width={'auto'}
            >
              {title}
            </P>
            {showEdit ? (
              <Img
                src={ICONS.PENCIL}
                alt="edit"
                $width={'16px'}
                $height={'16px'}
                onClick={handleEditClick}
              />
            ) : null}
          </Details>
        </DetailsTop>
      ) : null}
      <DetailsBottom $showGrid={showGrid}>
        {Object.keys(detailsData)?.map((item, index) => {
          if (item === 'activationStatus') return null;
          return (
            <ContentWrap key={index}>
              <P
                $color={'#000'}
                $fontSize={'14px'}
                $fontWeight={'400'}
                $lineHeight={'normal'}
                $width={customProps?.textWidth || '300px'}
              >
                {capitalizeKey(item)}
              </P>
              <ContentValue
                $color={'#606C85'}
                $fontSize={'14px'}
                $fontWeight={'400'}
                $lineHeight={'normal'}
                $maxWidth={'400px'}
              >
                {handleContentConfig(detailsData[item], item)}
              </ContentValue>
            </ContentWrap>
          );
        })}
      </DetailsBottom>
    </CustomerWrap>
  );
};
DetailsContainer.propTypes = {
  title: PropTypes.string,
  detailsData: PropTypes.object.isRequired,
  showEdit: PropTypes.bool,
  customProps: PropTypes.object,
  showTitle: PropTypes.bool,
  showGrid: PropTypes.bool,
  handleEditClick: PropTypes.func,
  setShowJobReelPage: PropTypes.func,
};
export default DetailsContainer;
