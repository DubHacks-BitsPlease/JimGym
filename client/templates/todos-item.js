var EDITING_KEY = 'EDITING_TODO_ID';

Template.todosItem.helpers({
  editingClass: function() {
    return Session.equals(EDITING_KEY, this._id) && 'editing';
  },
  todos: function() {
    return Todos.find();
  }
});

Template.todosItem.events({
  'click':function() {
    Session.set('selected_goal', this._id);
  },
  'click a.yes':function() {
    var goalId = Session.get('selected_goal');
    Todos.update(goalId, {$inc: {'score': 1 }}); 
  },
  
  'focus input[type=text]': function(event) {
    Session.set(EDITING_KEY, this._id);
  },
  
  'blur input[type=text]': function(event) {
    if (Session.equals(EDITING_KEY, this._id))
      Session.set(EDITING_KEY, null);
  },
  
  'keydown input[type=text]': function(event) {
    // ESC or ENTER
    if (event.which === 27 || event.which === 13) {
      event.preventDefault();
      event.target.blur();
    }
  },
  
  // update the text of the item on keypress but throttle the event to ensure
  // we don't flood the server with updates (handles the event at most once 
  // every 300ms)
  'keyup input[type=text]': _.throttle(function(event) {
    Todos.update(this._id, {$set: {text: event.target.value}});
  }, 300),
  
  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
  'mousedown .js-delete-item, click .js-delete-item': function() {
    Todos.remove(this._id);
    if (! this.checked)
      Lists.update(this.listId, {$inc: {incompleteCount: -1}});
  }
});