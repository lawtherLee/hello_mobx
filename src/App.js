import { observer } from "mobx-react";
import { action, autorun, computed, makeObservable, observable } from "mobx";
import { persist } from "mobx-persist";

const TodoView = observer(({ todo }) => {
  const onToggleCompleted = () => {
    todo.completed = !todo.completed;
  };

  const onRename = () => {
    todo.task = prompt("任务名称", todo.task) || todo.task;
  };

  return (
    <li onDoubleClick={onRename}>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggleCompleted}
        />
        {todo.task}
        {todo.assignee ? <small>{todo.assignee.name}</small> : null}
        {/*<RenderCounter />*/}
      </label>
    </li>
  );
});

const TodoList = observer(({ store }) => {
  const onNewTodo = () => {
    store.addTodo(prompt("输入新的待办：", "请来杯咖啡"));
  };
  const handleSyncTodo = () => {
    store.pendingRequests++;
    setTimeout(
      action(() => {
        store.pendingRequests--;
        store.addTodo("随机待办 " + Math.random());
      }),
      2000,
    );
  };
  return (
    <div>
      <button onClick={handleSyncTodo}>异步加载待办</button>
      {store.report}
      <ul>
        {store.todos.map((todo, idx) => (
          <TodoView todo={todo} key={idx} />
        ))}
      </ul>
      {store.pendingRequests > 0 ? <marquee>正在加载……</marquee> : null}
      <button onClick={onNewTodo}>新待办</button>
      <small>（双击待办进行编辑）</small>
      {/*<RenderCounter />*/}
    </div>
  );
});

export default function App() {
  return (
    <div>
      <TodoList store={observableTodoStore} />
    </div>
  );
}

class ObservableTodoStore {
  todos = [];
  obj = {
    a: 1,
    b: 2,
  };
  pendingRequests = 0;

  constructor() {
    makeObservable(this, {
      obj: observable,
      todos: observable,
      pendingRequests: observable,
      completedTodosCount: computed,
      report: computed,
      addTodo: action,
    });
    autorun(() => console.log(this.report));

    for (let i = 0; i < 5; this.addTodo(`待办${++i}`)) {}
  }

  get completedTodosCount() {
    return this.todos.filter((todo) => todo.completed === true).length;
  }

  get report() {
    if (this.todos.length === 0) return "<无>";
    const nextTodo = this.todos.find((todo) => todo.completed === false);
    return (
      `下一个待办："${nextTodo ? nextTodo.task : "<无>"}"。 ` +
      `进度：${this.completedTodosCount}/${this.todos.length}`
    );
  }

  addTodo(task) {
    this.todos.push({
      task: task,
      completed: false,
      assignee: null,
    });
  }
}

const observableTodoStore = new ObservableTodoStore();

const peopleStore = observable([{ name: " --Michel" }, { name: " --我" }]);
observableTodoStore.todos[0].assignee = peopleStore[0];
observableTodoStore.todos[1].assignee = peopleStore[1];
