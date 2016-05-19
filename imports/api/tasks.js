/**
 * Created by Scott on 4/2/2016.
 * stores Collections, the Publications that read from them and the Methods that write to them
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({
    'tasks.insert'(text, cost) {

        console.log(text);
        console.log(cost);

        //Make sure that text is a String
        check(text, String);
        //Make sure that cost is a Number
        check(cost, Number);

        //debug
        console.log(text);
        console.log(cost);

        // Make sure the user is logged in before inserting a task
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }

        //Actual database insertion
        Tasks.insert({
            text,
            cost,
            createdAt: new Date(),
            owner: this.userId,
            username: Meteor.users.findOne(this.userId).username,
        });
    },
    'tasks.remove'(taskId) {
        check(taskId, String);

        Tasks.remove(taskId);
    },
    'tasks.setChecked'(taskId, setChecked) {
        check(taskId, String);
        check(setChecked, Boolean);

        Tasks.update(taskId, { $set: { checked: setChecked } });
    },
});