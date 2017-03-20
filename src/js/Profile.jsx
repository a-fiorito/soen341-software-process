import React, { Component } from 'react';
import DocumentArea from './DocumentArea';// have a doc area showing notes that you uploaded
import Button from './Button';
import AddCourse from './AddCourse';
import axios from 'axios';

/*
Profile component which should appear when a user clicks on the 'view profile' button
*/

//const user = { id: '2', fname: 'Daniel', lname: 'Stroppolo', username: 'dstroppolo', type: 'student' };


class Name extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="name-container">
                <h1>{this.props.name || '-'}</h1>
                <h2>{this.props.username} | {this.props.type || '-'}</h2>
            </div>
        );
    }
}

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDocuments: false,
            showAdd: false,
            documents: []
        }
    }

    componentDidMount() {
        axios.get(`/pdfs/profile/${this.props.user.id}`)
        .then(res => {
            this.setState({documents: res.data});
        })
    }

    toggleBar = (e) => {
        this.setState({showDocuments: !this.state.showDocuments});
    }

    showAddPopup = () => {
        this.setState({showAdd: true});
    }

    addCourse = (c) => {
        if(c.name && c.number) {
            axios.post('/courses', {
                course: c,
                user: this.props.user
            });
            this.setState({showAdd: false});
        } else {
            console.log('invalid')
        }
    }

    addCourseCancelled = () => {
        this.setState({showAdd: false});
    }

    /*My idea for this section is to eventually add a DocumentArea which displays
    the notes that you have uploaded, so you can delete them? or update them? For
    example, for the thumbnail component have a state called edit where these
    options appear.
    feel free to remove the DocumentArea, I just didn't know what else to put on
    the page.*/
    render() {
        return (
            <div className='profile-area'>
                <div className="profile">
                    <div className='profile-top'>
                        <div className="name-image-container">
                            <img src="/assets/images/user.svg" />
                            <Name {...this.props.user} />{/*pass the user object we will eventually get from the db*/}
                        </div>
                        <div className='button-wrapper'>
                            <Button isDisabled={this.state.showAdd} func={this.showAddPopup}label="Add or join a class" /*you will pass the action here eventually action={} */ />
                            {this.state.showAdd && <AddCourse add={this.addCourse} cancelled={this.addCourseCancelled} />}
                        </div>
                    </div>
                    <div className="profile-body">
                        <div className="bibliography">
                            <h3>Bibliography</h3>
                        </div>

                        <div className="statistics">
                            <h3>Statistics</h3>
                        </div>
                        <div className="document-container">
                            <div onClick={this.toggleBar} className="toggle-bar"><h3>Uploaded Notes</h3><img className={this.state.showDocuments && "show"} src="/assets/images/indicator.svg" /></div>
                            {this.state.showDocuments && <DocumentArea documents={this.state.documents} selectedCourse={true} user={this.props.user} location={this.props.location.pathname} />}
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
