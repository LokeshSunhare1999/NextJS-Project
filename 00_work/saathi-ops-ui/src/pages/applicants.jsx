import React, { Suspense, lazy, useEffect, useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import ICONS from '../assets/icons';
import styled from 'styled-components';
import styleComponents from '../style/pageStyle';
import ShakaVideoPlayer from '../components/common/ShakaVideoPlayer';
import VideoPlayer from '../components/common/VideoPlayer';
import { useGetAllApplicants, useGetAllCustomers } from '../apis/queryHooks';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  font-family: Poppins;
`;

const TopCard = styled.div`
  margin: 20px;
  color: #000;
  font-family: Poppins;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ProfileCard = styled.div`
  display: flex;
  width: calc(100% - 80px);
  margin: 10px 20px;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const DetailsSection = styled.div`
  margin-top: 20px;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(2, 1fr);
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
`;

const ItemTitle = styled.span`
  color: #000;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
`;

const ItemValue = styled.span`
  color: #606c85;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
`;

const ItemLink = styled.a`
  color: #606c85;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const VideoSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const VideoCard = styled.div`
  width: 60%;
`;

const Applicants = ({ isMpd = false }) => {
  const navigate = useNavigate();
  const {
    data: allApplicantsData,
    isLoading: allApplicantsDataLoading,
    isFetching: allApplicantsDataFetching,
    isError: isAllApplicantsDataError,
    error: allApplicantsDataError,
    refetch: refetchAllApplicants,
  } = useGetAllApplicants();
  return (
    <Wrapper>
      <TopCard>All Applicants</TopCard>
      {allApplicantsData?.response?.map((item) => (
        <ProfileCard>
          <VideoSection>
            <VideoCard>
              {isMpd ? (
                <ShakaVideoPlayer
                  aspectRatio={aspectRatio}
                  videoLink={videoLink}
                />
              ) : (
                <VideoPlayer
                  aspectRatio="9/16"
                  videoLink={item?.customerBioDataVideo}
                />
              )}
            </VideoCard>
          </VideoSection>

          <DetailsSection>
            <GridItem>
              <ItemTitle>Name : &nbsp;</ItemTitle>
              <ItemValue>{item?.name || '-----'}</ItemValue>
            </GridItem>
            <GridItem>
              <ItemTitle>Phone No : &nbsp;</ItemTitle>
              <ItemValue>{`XXXX${item?.primaryContact?.phoneNo?.slice(-6)}`}</ItemValue>
            </GridItem>

            <GridItem>
              <ItemTitle>Saathi ID : &nbsp;</ItemTitle>
              <ItemValue>{item?.saathiId}</ItemValue>
            </GridItem>

            <GridItem>
              <ItemTitle>Customer ID : &nbsp;</ItemTitle>
              <ItemLink
                onClick={() => navigate(`/customers/${item?._id}`)}
              >{`XXXX${item?._id?.slice(-6)}`}</ItemLink>
            </GridItem>
          </DetailsSection>
        </ProfileCard>
      ))}
    </Wrapper>
  );
};

export default Applicants;
