import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import CancelIcon from 'static/images/svg/cancel.svg'

const AddTeamEvent = (props) => {
    const { handleClose, isModalVisible, handleSubmit, addTeam, TeamChangehandler, handleSearch , deleteTeamHandler  } = props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Add Teams"
            buttonCond = { true }
            className="add-event-modal"
            id='add-team'
        >
            <div className="add-items-modal">
                <div className="row g-0">
                    <div className="col-4">
                        <label className="team-label">Team No.</label>
                    </div>
                    <div className="col-8 d-flex justify-content-between">
                        <label className="team-label">Team Name</label>
                    </div>
                </div>
                {
                    addTeam.map((item, index) => {
                        return (
                            <div key={ index } >
                                <div className="row g-0 my-3">
                                    <div className="col-4">
                                        <input
                                            name="team_number"
                                            data-id={ index }
                                            value={ addTeam.team_number }
                                            maxLength="4"
                                            onChange = { TeamChangehandler }
                                            placeholder="Enter team no."
                                            className="number-input m-0"
                                            autoComplete="off"
                                            autoFocus={ true }
                                        />
                                    </div>
                                    <div className="col-8">
                                        <div className="d-flex align-items-center">
                                            <input
                                                name="team_name"
                                                data-id={ index }
                                                value={ addTeam.team_name }
                                                onChange = { TeamChangehandler  }
                                                placeholder="Enter team name"
                                                onKeyPress={ (e) => e.key === 'Enter' && handleSearch() }
                                                className="name-input m-0"
                                                autoComplete="off"
                                            />
                                            <button disabled={ addTeam.length === 1 } className="btn btn-link p-0">
                                                <img src={ CancelIcon } alt="cancel" disabled className="ms-2 pointer" onClick={ () => deleteTeamHandler(item.team_number) } />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </ModelViewLayoutContainer>
    );
};

AddTeamEvent.propTypes = {
    handleClose: PropTypes.func,
    TeamChangehandler: PropTypes.func,
    handleSearch: PropTypes.func,
    deleteTeamHandler: PropTypes.func,
    isModalVisible: PropTypes.func,
    handleSubmit: PropTypes.func,
    handleTeamChange: PropTypes.func,
    addTeam: PropTypes.object,
    id: PropTypes.string
};

export default AddTeamEvent;
