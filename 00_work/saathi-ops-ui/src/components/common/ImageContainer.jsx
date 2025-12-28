import React from 'react';
import styled from 'styled-components';
import PDFViewer from '../PDFViewer';

const Container = styled.div`
  display: flex;
  margin-top: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  justify-content: center;
`;
const ImageContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;
const Image = styled.img`
  width: 240px;
  height: auto;
  padding: 0px 20px;
  margin-top: 10px;
  border-right: ${(props) => (!props.$isLast ? '1px solid #cdd4df' : '')};
`;
const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  margin-top: 6px;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  text-decoration: ${(props) => props.$textDecoration || 'none'};
  color: ${(props) => props.$color || '#000'};
  cursor: ${(props) => props.$cursor || 'auto'};
`;
const Hr = styled.div`
  width: 100%;
  height: 1px;
  background: #cdd4df;
  margin: 10px 0px;
`;
const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => props?.$gap || '8px'};
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;
const Anchor = styled.a`
  color: #3b2b8c;
  font-family: Poppins;
  font-size: 12px;
  font-style: normal;
  font-weight: 300;
  line-height: normal;
  text-decoration: none;
  cursor: pointer;
`;

const handleFileDownload = (url, customFileName) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = customFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ImageContainer = ({ images, detailsData }) => {
  if (images?.length === 0) return null;
  const fileData = images?.map((item) => {
    return { ...item, fileType: item?.image?.split('.').pop() };
  });

  const fileName = `${detailsData?.['Company Name']}_PAN_${Date.now()}`;

  const getElementBasedOnFileExtension = (extension, item, idx) => {
    switch (extension) {
      case 'pdf':
        return (
          <FlexContainer
            $flexDirection="column"
            $marginTop="20px"
            $gap="2px"
            key={`item-${idx}`}
          >
            <PDFViewer pdfUrl={item?.image} />
            <P $fontSize={'14px'} $fontWeight={'300'} $lineHeight={'normal'}>
              {item?.title}
            </P>
          </FlexContainer>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <ImageContent key={`item-${idx}`}>
            <Image src={item?.image} $isLast={idx === images?.length - 1} />
            <P $fontSize={'14px'} $fontWeight={'300'} $lineHeight={'normal'}>
              {item?.title}
            </P>
          </ImageContent>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Container>
        {fileData?.map((item, idx) =>
          getElementBasedOnFileExtension(item?.fileType, item, idx),
        )}
      </Container>
      <Hr />
    </>
  );
};

export default ImageContainer;
