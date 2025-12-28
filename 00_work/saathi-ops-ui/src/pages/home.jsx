import React, { useContext, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { UserContext } from '../context/UserContext';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
const DetailsContainer = lazy(
  () => import('../components/atom/tableComponents/DetailsContainer'),
);

const Wrapper = styled.div`
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: 16px 40px;
  font-family: Poppins;
`;

const Header = styled.div`
  width: calc(100% - 0px);
  margin: 0px 0px 20px 0px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const AnimatedBox = styled(Box)`
  width: calc(100% - 55px);
`;

const Home = () => {
  const { user } = useContext(UserContext);
  const detailsData = {
    Name: user?.name || '-----',
    email: user?.loggedInUserContact?.email || '-----',
    phone: user?.loggedInUserContact?.phoneNo || '-----',
  };
  return (
    <Wrapper>
      <Header>
        <HeaderTitle>Home</HeaderTitle>
      </Header>
      <Suspense
        fallback={
          <AnimatedBox>
            {[1, 2, 3, 4, 5].map((item, idx) => {
              return <Skeleton animation="wave" height={70} key={idx} />;
            })}
          </AnimatedBox>
        }
      >
        <DetailsContainer title={'User Details'} detailsData={detailsData} />
      </Suspense>
    </Wrapper>
  );
};

export default Home;
