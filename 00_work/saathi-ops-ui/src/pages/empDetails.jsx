import { useParams } from 'react-router-dom';
import EmployerDetails from '../components/employers/EmployerDetails';

const EmployerDetailsRouter = () => {
  const { id } = useParams();

  return <EmployerDetails id={id} />;
};

export default EmployerDetailsRouter;
