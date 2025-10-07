/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable computed-property-spacing */
/* eslint-disable array-bracket-spacing */
/* eslint-disable react/jsx-curly-spacing */
/* eslint-disable no-loop-func */
/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import 'static/style/files.scss'
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import upload from 'static/images/svg/upload-up-arrow.svg'
import { importReportsActions } from 'actions/fileActions';
import { Button } from 'antd';

function ImportReport(props) {
    const dispatch = useDispatch()
    const { handleClose, isModalVisible, isSelected, setIsSelected } = props;
    const isLoading = useSelector((state) => state.modalIsLoading);
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState("");
    const [reportData, setReportData] = useState("");
    useEffect(() => () => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const handleChange = (event) => {
        const { type } = event.target;
        if (type === 'file'){
            setIsSelected(true)
            setSelectedFiles(event.target.files);
            var data = new FormData();
            for (const key of Object.keys(event.target.files)) {
                data.append('files', event.target.files[key])
            }
            setReportData(data);
        }
    };
    const handleSubmit = () => {
        dispatch(importReportsActions(reportData));
        setIsSelected(false);
        setSelectedFiles("");
        handleClose();
    }
    return (
        <>
            <ModelViewLayoutContainer
                handleClose={handleClose}
                isModalVisible={isModalVisible}
                handleSubmit={handleSubmit}
                title="Import Orders"
                id='create-folder'
            >
                <div className="create-folder">
                    <div className="drag-wrapper">
                        <input id="profileImage" name="csvfile" className="xls-upload" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" onChange={ handleChange }/>
                        <img src={upload} alt="upload-img" className="upload-img" />
                        <div className="upload-lbl">Browse <br />or <br />Drag and drop</div>
                    </div>
                    <div className='text-end mt-3'>
                        {selectedFiles && <p className="upload-lbl">Name: {selectedFiles[0].name} selected</p>}
                        {
                            isLoading ? (
                                <Button
                                    type="button"
                                    className="modal-add"
                                    disabled
                                >
                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    &nbsp;Uploading...
                                </Button>
                            ) : (
                                <Button
                                    key="submit"
                                    type="primary"
                                    onClick={handleSubmit}
                                    className="modal-add"
                                    data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                                    disabled={ !isSelected ? true : false }
                                >
                                    Upload
                                </Button>
                            )
                        }
                    </div>
                </div>
            </ModelViewLayoutContainer>
        </>
    )
}

ImportReport.propTypes = {
    files: PropTypes.array,
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    isSelected: PropTypes.bool,
    setIsSelected: PropTypes.string
}

export default ImportReport
