/**
 * Created by Scott on 4/2/2016.
 */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
//render collection of tasks
class App extends Component {
    //componenet contructor that contains initializations for: hideCompleted
    constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    //Event handler for when you press enter to input data
    // Calls Meteor method tasks.insert and sends it the text,
    //then clears the text form
    handleSubmit(event) {
        event.preventDefault();

        // Find the task text field via the React ref
        const taskText = this.refs.textInput.value.trim();
        // Find the cost field via the React ref
        const costNum = this.refs.costInput.value.trim();

        //debug
        console.log(taskText);
        console.log(costNum);

        //Call the tasks insert method in tasks.js api
        Meteor.call('tasks.insert', taskText, costNum);

        // Clear task form
        this.refs.textInput.value = '';
        //Clear cost form
        ReactDOM.findDOMNode(this.refs.costInput).value = '';


        //ADDITION/SUBTRACTION LOGIC TO tasks.js HERE
    }

    //Event handler for hideCompleted checkbox check
    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    //Filters out tasks that have hideCompleted === true
    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => (
            <Task key={task._id} task={task} />
        ));
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>The Economy</h1> ({this.props.incompleteCount})
                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted.bind(this)}
                        />
                        Hide Completed Tasks
                    </label>

                    <AccountsUIWrapper />

                    { this.props.currentUser ?
                        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                            <input
                                type="text"
                                ref="textInput"
                                placeholder="Type to add new tasks"
                            />
                            <input
                                type="Number"
                                ref="costInput"
                                placeholder="Type to add cost"
                            />
                            <input type="submit" value="Submit" />
                        </form> : ''
                    }
                </header>

                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
}

//proptypes - set up the component's proptypes
App.propTypes = {
    tasks: PropTypes.array.isRequired,
    incompleteCount: PropTypes.number.isRequired,
    currentUser: PropTypes.object,
};

//exports createContainer function which queries the tasks collection
export default createContainer(() => {
    return {
        tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
        incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
        currentUser: Meteor.user(),
//        currentBalance: Tasks.characters.aggregate([ { $group: { _id: null, total: { $sum: "$cost" } } } ]),
    };
}, App);