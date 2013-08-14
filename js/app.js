App = Ember.Application.create();

App.Router.map(function() {
    this.resource("other", { path: "/" });
    this.resource("people", { path: "/people" });
});

//todo -until the bug in RC6 is fixed we can't redirect
//because App.reset() will fire the "/" route right away
//meaning we cannot mock the $.ajax
// App.OtherRoute = Ember.Route.extend({
//     redirect: function() {
//         this.transitionTo('people');
//     }
// });

App.PeopleRoute = Ember.Route.extend({
    model: function() {
        return App.Person.find();
    }
});

App.PeopleController = Ember.ArrayController.extend({
    addPerson: function() {
        var person = {
            firstName: this.get('firstName'),
            lastName: this.get('lastName')
        };
        App.Person.add(person);
    },
    deletePerson: function(person) {
        App.Person.remove(person);
    }
});

App.Person = Ember.Object.extend({
    firstName: '',
    lastName: '',
    fullName: function() {
        var firstName = this.get('firstName');
        var lastName = this.get('lastName');
        return firstName + ' ' + lastName;
    }.property('firstName', 'lastName')
});

App.Person.reopenClass({
    people: [],
    add: function(hash) {
        var person = App.Person.create(hash);
        this.people.pushObject(person);
    },
    remove: function(person) {
        this.people.removeObject(person);
    },
    find: function() {
        var self = this;
        $.getJSON('/api/people', function(response) {
            response.forEach(function(hash) {
                var person = App.Person.create(hash);
                Ember.run(self.people, self.people.pushObject, person);
            });
        }, this);
        return this.people;
    }
});
