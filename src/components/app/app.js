import React, {Component} from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-from';

import './app.css';

export default class App extends Component {
    maxId = 4;

    state = {
        todoData: [
            this.createItem('Drink Coffee'),
            this.createItem('Make Awesome App'),
            this.createItem('Have a lunch')
        ],
        term: '',
        filter: 'All'
    };

    createItem (label) {
        return {
            label,
            important: false,
            done: false,
            id: this.maxId++
        }
    };

    deleteItem = (id) => {
        this.setState(({ todoData }) => {
            const idx = todoData.findIndex(el => el.id === id);
            const newArray = [...todoData.slice(0, idx), ...todoData.slice(idx + 1)];

            return {
                todoData: newArray
            }
        });
    };

    addItem = (text) => {
        const newItem = this.createItem(text);

        this.setState(({ todoData}) => {
            const newArray = [...todoData, newItem];

            return {
                todoData: newArray
            }
        })
    };

    toggleProperty (arr, id, propName) {
        const idx = arr.findIndex(el => el.id === id);
        const oldItem = arr[idx];
        const newItem = {...oldItem, [propName]: !oldItem[propName]};
        const newArray = [...arr.slice(0, idx),  newItem, ...arr.slice(idx + 1)];

        return newArray;
    }

    onToggleDone = (id) => {
        this.setState(({ todoData }) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'done')
            }
        });
    };

    onToggleImportant = (id) => {
        this.setState(({ todoData }) => {
            return {
                todoData: this.toggleProperty(todoData, id, 'important')
            }
        });
    };

    searchItems(items, term) {
        if (term.length === 0) {
            return items
        }

        return items.filter(item => {
            return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
        })
    };

    onSearchChange = (term) => {
        this.setState({ term });
    }

    filterItems(items, filter) {
        switch(filter) {
            case'all':
                return items;
            case 'active':
                return items.filter(item => !item.done);
            case 'done':
                return items.filter(item => item.done);
            default:
                return items;
        }
    }

    onFilterChange = (filter) => {
        this.setState({ filter });
    }

    render() {
        const { todoData, term, filter } = this.state;

        const visibleItems = this.filterItems(this.searchItems(todoData, term), filter);
        const doneCount = todoData.filter(el => el.done).length;
        const todoCount = todoData.length - doneCount;

        return (
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount} />
                <div className="top-panel d-flex">
                    <SearchPanel onSearchChange={this.onSearchChange} />
                    <ItemStatusFilter
                        filter={filter}
                        onFilterChange={this.onFilterChange}
                    />
                </div>

                <TodoList
                    todos={visibleItems}
                    onDeleted={this.deleteItem}
                    onToggleDone={this.onToggleDone}
                    onToggleImportant={this.onToggleImportant}
                />

            <ItemAddForm onAdded={this.addItem}/>
            </div>
        );
    }
};
