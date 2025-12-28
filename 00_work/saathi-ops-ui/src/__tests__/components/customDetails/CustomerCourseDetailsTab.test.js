import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerCoursesDetailsTab from '../../../components/customerDetails/CustomerCoursesDetailsTab';
import useCustomerCourseDetails from '../../../hooks/customer/useCustomerCourseDetails';

// Mock the dependencies
jest.mock('react', () => {
    const originalReact = jest.requireActual('react');
    return {
        ...originalReact,
        lazy: jest.fn((importFn) => {
            // Return the mocked DisplayTable component directly
            const module = jest.requireMock('../../../components/DisplayTable');
            return module;
          }),
        Suspense: ({ children }) => children,
    };
});

jest.mock('../../../hooks/customer/useCustomerCourseDetails');
jest.mock('../../../assets/icons', () => ({
    EYE: 'eye-icon',
}));

jest.mock('../../../components/DisplayTable', () => {
    return function MockDisplayTable(props) {
        return (
            <div data-testid="display-table">
                <button
                    data-testid="row-click"
                    onClick={() => props.onClickFn()}
                >
                    Click Row
                </button>
                <button
                    data-testid="action-details"
                    onClick={() => {
                        props.setActionIndex();
                        props.setActionOpen(true);
                        props.arrBtn[0].onClick();
                    }}
                >
                    Details Action
                </button>
                <button
                    data-testid="action-trophy"
                    onClick={() => {
                        props.setActionIndex();
                        props.setActionOpen(true);
                        props.arrBtn[1].onClick();
                    }}
                >
                    Trophy Action
                </button>
                <button
                    data-testid="action-certificate"
                    onClick={() => {
                        props.setActionIndex();
                        props.setActionOpen(true);
                        props.arrBtn[2].onClick();
                    }}
                >
                    Certificate Action
                </button>
                <button
                    data-testid="action-medal"
                    onClick={() => {
                        props.setActionIndex();
                        props.setActionOpen(true);
                        props.arrBtn[3].onClick();
                    }}
                >
                    Medal Action
                </button>
            </div>
        );
    };
});

jest.mock('../../../components/common/BoxLoader', () => {
    return function MockBoxLoader() {
        return <div data-testid="box-loader">Loading...</div>;
    };
});
jest.mock('../../../components/customerDetails/ViewCustomerCourseDrawer', () => {
    return function MockViewCustomerCourseDrawer(props) {
        return (
            <div data-testid="course-drawer" onClick={props.toggleDrawer}>
                {props.open ? 'Course Drawer Open' : 'Course Drawer Closed'}
            </div>
        );
    };
});
jest.mock('../../../components/customerDetails/ViewCustomerTestDrawer', () => {
    return function MockViewCustomerTestDrawer(props) {
        return (
            <div data-testid="test-drawer" onClick={props.toggleDrawer}>
                {props.open ? 'Test Drawer Open' : 'Test Drawer Closed'}
            </div>
        );
    };
});

describe('CustomerCoursesDetailsTab', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockProps = {
        customerId: 'customer123',
        setTotalPurchasedCourses: jest.fn(),
    };

    const mockHookReturn = {
        customerCoursesHeaders: [
            { name: 'Course Name', type: 'text' },
            { name: 'Status', type: 'text' },
        ],
        customerCourseTableHeaders: ['Course Name', 'Status'],
        customerCourseRows: [
            { id: '1', data: ['React Basics', 'Completed'] },
            { id: '2', data: ['Advanced JavaScript', 'In Progress'] },
        ],
        handleDetailsClick: jest.fn(),
        handleTrophyClick: jest.fn(),
        handleCertificateClick: jest.fn(),
        handleMedalClick: jest.fn(),
        certificateLinks: { 0: ['cert1.pdf'], 1: [] },
        trophyLinks: { 0: ['trophy1.png'], 1: [] },
        medalLinks: { 0: ['medal1.png'], 1: [] },
        toggleCustomerCourseDrawer: jest.fn(),
        toggleCustomerTestDrawer: jest.fn(),
        handleRowClick: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useCustomerCourseDetails.mockReturnValue(mockHookReturn);
    });

    it('renders loader when headers are not available', () => {
        useCustomerCourseDetails.mockReturnValueOnce({
            ...mockHookReturn,
            customerCourseTableHeaders: [],
        });

        render(<CustomerCoursesDetailsTab {...mockProps} />);
        expect(screen.getByTestId('box-loader')).toBeInTheDocument();
        expect(screen.queryByTestId('display-table')).not.toBeInTheDocument();
    });

    it('renders table when headers are available', () => {
        render(<CustomerCoursesDetailsTab {...mockProps} />);
        expect(screen.getByTestId('display-table')).toBeInTheDocument();
    });

    it('handles row click correctly', () => {
        render(<CustomerCoursesDetailsTab {...mockProps} />);
        fireEvent.click(screen.getByTestId('row-click'));
        expect(mockHookReturn.handleRowClick).toHaveBeenCalledWith();
    });

    it('handles details button click correctly', () => {
        render(<CustomerCoursesDetailsTab {...mockProps} />);
        fireEvent.click(screen.getByTestId('action-details'));
        expect(mockHookReturn.handleDetailsClick).toHaveBeenCalledWith();
    });

    it('handles trophy button click correctly', () => {
        render(<CustomerCoursesDetailsTab {...mockProps} />);
        fireEvent.click(screen.getByTestId('action-trophy'));
        expect(mockHookReturn.handleTrophyClick).toHaveBeenCalledWith();
    });

    it('handles certificate button click correctly', () => {
        render(<CustomerCoursesDetailsTab {...mockProps} />);
        fireEvent.click(screen.getByTestId('action-certificate'));
        expect(mockHookReturn.handleCertificateClick).toHaveBeenCalledWith();
    });

    it('handles medal button click correctly', () => {
        render(<CustomerCoursesDetailsTab {...mockProps} />);
        fireEvent.click(screen.getByTestId('action-medal'));
        expect(mockHookReturn.handleMedalClick).toHaveBeenCalledWith();
    });

    it('toggles course drawer correctly', () => {
        render(<CustomerCoursesDetailsTab {...mockProps} />);
        const courseDrawer = screen.getByTestId('course-drawer');
        expect(courseDrawer).toHaveTextContent('Course Drawer Closed');
    });

    it('toggles test drawer correctly', async () => {
        render(<CustomerCoursesDetailsTab {...mockProps} />);
        const testDrawer = screen.getByTestId('test-drawer');
        expect(testDrawer).toHaveTextContent('Test Drawer Closed');

        // Click to toggle the drawer
        fireEvent.click(testDrawer);
        expect(mockHookReturn.toggleCustomerTestDrawer).toHaveBeenCalled();
    });

    it('passes correct props to custom hook', () => {
        render(<CustomerCoursesDetailsTab {...mockProps} />);
        expect(useCustomerCourseDetails).toHaveBeenCalledWith(
            mockProps.customerId,
            mockProps.setTotalPurchasedCourses,
            expect.any(String), // actionIndex
            expect.any(Function), // setActionOpen
            expect.any(Function), // setOpenCustomerCourseDrawer
            expect.any(Function), // setOpenCustomerTestDrawer
            expect.any(Function), // setCourseObj
        );
    });
});