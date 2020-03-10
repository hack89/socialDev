import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import ProfileItem from './ProfileItem'
import {connect} from 'react-redux'
import {getProfiles} from '../../actions/profile'

const Profiles = ({getProfiles, profile: {loading, profiles}}) => {
    
    useEffect(()=>{
        getProfiles()
    },[getProfiles])
    
    return (
        <Fragment>
            {loading ? <Spinner /> : <Fragment>
                <h1 className="large text-primary">Developers</h1>
                <p className="lead"> <i className="fab fa-connectdevelop"></i> Brows with devs</p>
                <div className="profiles">
                    {profiles.length > 0 ? (
                        profiles.map(profile => (
                            <ProfileItem key={profile._id} profile={profile}/>
                        ))
                    ) : <h4> No profile found</h4>}
                </div>
            </Fragment> }
        </Fragment>
    )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, {getProfiles})(Profiles)
