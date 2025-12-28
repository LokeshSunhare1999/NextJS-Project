import React, { useRef } from 'react';
import styled from 'styled-components';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import { zIndexValues } from '../style';
import PropTypes from 'prop-types';
import usePermission from '../hooks/usePermission';

const P = styled.p`
  white-space: nowrap;
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => (props?.$fontSize ? props.$fontSize : '14px')};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const ViewRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const ActionWrapper = styled.div`
  display: inline-flex;
  width: ${(props) => (props?.$width ? props?.$width : 'auto')};
  min-width: 200px;
  padding: 5px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.12);
  position: absolute;
  top: ${(props) => (props?.$top ? props?.$top : '30px')};
  right: ${(props) => (props?.$right ? props?.$right : '30px')};
  left: ${(props) => (props?.$left ? props?.$left : 'auto')};
  z-index: ${zIndexValues.ACTION_BUTTON};
`;

const BtnDiv = styled.div`
  display: flex;
  padding: 8px 10px;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  cursor: pointer;
`;

const Hr = styled.div`
  width: 100%;
  height: 1px;
  background: #cdd4df;
`;

const StyledInput = styled.input`
  display: none;
`;

const ArrayDiv = styled.div`
  width: 100%;
`;

const ActionButton = ({
  arrBtn,
  setActionOpen,
  isLast = false,
  top,
  fontSize,
  right,
  left,
  width,
}) => {
  const { hasPermission } = usePermission();
  const hiddenFileInput = useRef(null);

  const handleInputBtnClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleInputChange = (event, index) => {
    const fileUploaded = event.target.files[0];
    arrBtn[index].handleFileUpload(fileUploaded);
    setActionOpen(false);
  };

  const handleClickAway = () => {
    setActionOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <ActionWrapper
        $isLast={isLast}
        $top={top}
        $right={right}
        $left={left}
        $width={width}
      >
        {arrBtn?.map((btn, index) => {
          if (btn.permission && !hasPermission(btn.permission)) {
            return null;
          }

          return (
            <ArrayDiv key={index} >
              {btn.type === 'input' ? (
                <StyledInput
                  type="file"
                  onChange={(e) => handleInputChange(e, index)}
                  ref={hiddenFileInput}
                />
              ) : null}

              {btn.isVisible ? (
                <>
                  {index !== 0 ? <Hr /> : ''}

                  <BtnDiv
                    $isCustomIcon={btn?.customIcon ? true : false}
                    onClick={
                      btn.type !== 'input'
                        ? (e) => btn.onClick(e)
                        : handleInputBtnClick
                    }
                  >
                    <Img
                      src={btn.icon}
                      width={btn.iconWidth}
                      height={btn.iconHeight}
                      alt={`btn_${btn.text}`}
                    />
                    <ViewRight>
                      <P
                        $color={btn.color}
                        $fontSize={fontSize}
                        $fontWeight={'400'}
                        $lineHeight={'normal'}
                      >
                        {btn.text}
                      </P>

                      {btn?.customIcon ? (
                        <Img
                          src={btn.customIcon}
                          width={btn.customIconWidth}
                          height={btn.customIconHeight}
                          alt={`btn_${btn.text}`}
                        />
                      ) : null}
                    </ViewRight>
                  </BtnDiv>
                </>
              ) : null}
            </ArrayDiv>
          );
        })}
      </ActionWrapper>
    </ClickAwayListener>
  );
};
ActionButton.propTypes = {
  arrBtn: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      onClick: PropTypes.func,
      handleFileUpload: PropTypes.func,
      icon: PropTypes.string,
      iconWidth: PropTypes.string,
      iconHeight: PropTypes.string,
      text: PropTypes.string,
      color: PropTypes.string,
      isVisible: PropTypes.bool,
      customIcon: PropTypes.string,
      customIconWidth: PropTypes.string,
      customIconHeight: PropTypes.string,
    }),
  ).isRequired,
  setActionOpen: PropTypes.func.isRequired,
  isLast: PropTypes.bool,
  top: PropTypes.string,
  fontSize: PropTypes.string,
  right: PropTypes.string,
  left: PropTypes.string,
  width: PropTypes.string,
};

export default ActionButton;
