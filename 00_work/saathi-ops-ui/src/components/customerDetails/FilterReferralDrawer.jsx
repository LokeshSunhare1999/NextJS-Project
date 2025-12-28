import React from 'react';
import styled from 'styled-components';
import CustomCTA from '../CustomCTA';
import DisplayDrawer from '../common/DisplayDrawer';
import DrawerInput from '../common/DrawerInput';
import { zIndexValues } from '../../style';

const StyledHeader = styled.p`
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
  margin: ${(props) => props?.$margin};
  width: ${(props) => (props?.$width ? props?.$width : '100%')};
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: ${(props) => (props.$gap ? props.$gap : '10px')};
  opacity: ${(props) => (props.$opacity ? props.$opacity : '1')};
`;

const ContentSection = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 16px 20px;
`;

const FilterReferralDrawer = ({
  open,
  toggleDrawer,
  totalFiltersCount,
  handleApplyClick,
  clearFilters,
  filterCheckboxes,
}) => {
  const handleCloseDrawer = () => {
    toggleDrawer();
  };
  const headerContent = () => {
    return (
      <StyledHeader
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        Filter
      </StyledHeader>
    );
  };

  const footerContent = () => {
    return (
      <>
        <CustomCTA
          onClick={handleApplyClick}
          title={'Apply'}
          color={'#FFF'}
          bgColor={'#141482'}
          border={'1px solid #CDD4DF'}
        />
      </>
    );
  };
  const extraFooterContent = () => {
    return (
      <CustomCTA
        onClick={clearFilters}
        title={'Clear Filters'}
        color={'#141482'}
        bgColor={'#FFF'}
        border={'1px solid #141482'}
        disabled={totalFiltersCount === 0}
        opacity={totalFiltersCount === 0 ? 0.5 : 1}
      />
    );
  };
  return (
    <DisplayDrawer
      open={open}
      handleCloseDrawer={handleCloseDrawer}
      headerContent={headerContent}
      footerContent={footerContent}
      extraFooterContent={extraFooterContent}
      zIndex={zIndexValues?.FILTER_DRAWER}
    >
      {filterCheckboxes?.map((filter, index) => (
        <ContentSection key={index}>
          <DrawerInput
            fieldType={filter?.fieldType || 'filter'}
            fieldHeader={filter?.fieldHeader || ''}
            showFieldHeader={filter?.showFieldHeader ?? true}
            filterHeader={filter?.filterHeader || ''}
            headerWeight={filter?.headerWeight || '500'}
            checkboxes={filter?.checkboxes || []}
            handleCheckboxChange={filter?.handleCheckboxChange || (() => {})}
            filterClassname={filter?.filterClassname}
          />
        </ContentSection>
      ))}
    </DisplayDrawer>
  );
};
export default FilterReferralDrawer;
