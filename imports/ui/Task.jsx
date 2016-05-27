/**
 * Created by Scott on 4/2/2016.
 */
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import { Tasks } from '../api/tasks.js';

// Task component - represents a single todo item. contains elements
export default class Task extends Component {
    toggleChecked() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    //event handler
    deleteThisTask() {
        Meteor.call('tasks.remove', this.props.task._id);
    }

    render() {
        // Give tasks a different className when they are checked off,
        // so that they can be styled nicely in CSS
        const taskClassName = this.props.task.checked ? 'checked' : '';

        return (
            <li className={taskClassName}>
                <button className="delete" onClick={this.deleteThisTask.bind(this)}>
                    &times;
                </button>

                <input
                    type="checkbox"
                    readOnly
                    checked={this.props.task.checked}
                    onClick={this.toggleChecked.bind(this)}
                />

                <span className="text">
                  <strong>{this.props.task.username}</strong>: {this.props.task.text} <span className="cost">${this.props.task.cost}</span>
                </span>
            </li>
        );
    }
}

Task.propTypes = {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    task: PropTypes.object.isRequired,
};