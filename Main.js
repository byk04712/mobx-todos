import React,{
    Component,
    PropTypes
} from 'react';
import {
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    TextInput,
    ListView,
    Keyboard,
    View,
    Text
} from 'react-native';
import {
    observable,
    computed,
    action,
    useStrict
} from 'mobx';
import {
    observer
} from 'mobx-react/native';


// 开启严格模式，建议开启。开启后所有修改 observable 的操作都必须放在 action 里完成
useStrict(true);


const { width, height } = Dimensions.get('window');
const contentWidth = width - 60;
const [ALL, COMPLETED, UNCOMPLETED] = ['ALL', 'COMPLETED', 'UNCOMPLETED'];
const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        paddingVertical: 80
    },
    header: {
        width: contentWidth,
        height: 40,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'green'
    },
    input: {
        flex: 1,
        paddingHorizontal: 10
    },
    button: {
        width: 80,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white'
    },
    showTodos: {
        borderColor: 'green',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        width: contentWidth,
        height: height - 300
    },
    listView: {
        paddingHorizontal: 10
    },
    item: {
        flexDirection: 'row',
        height: 50,
        borderBottomColor: '#CCC',
        borderBottomWidth: StyleSheet.hairlineWidth,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        width: contentWidth - 90,
        overflow: 'hidden'
    },
    done: {
        fontSize: 12,
        color: 'gray'
    },
    del: {
        borderWidth: 1,
        borderColor: 'gray',
        width: 20,
        height: 20,
        borderRadius: 10
    },
    delText: {
        alignSelf: 'center'
    },
    filter: {
        width: contentWidth,
        height: 50,
        borderWidth: 1,
        borderColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5
    },
    condition: {
        paddingHorizontal: 5,
        paddingVertical: 7,
        marginHorizontal: 4,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'gray'
    },
    conditionText: {
        fontSize: 14,
        letterSpacing: 2
    }
});


class TodoList {

    @observable
    _items = [];

    @observable
    filter = ALL;

    // 初始化3条测试数据
    constructor() {
        this._items.push(new Todo('Travel', true, this));
        this._items.push(new Todo('Metting', false, this));
        this._items.push(new Todo('Conversation', true, this));
    }

    @computed
    get items() {
        return this._items.filter(item => {
            if (this.filter === ALL) {
                return item;
            } else if (this.filter === COMPLETED) {
                return item.done;
            } else if (this.filter === UNCOMPLETED) {
                return !item.done
            }
        });
    }

    @computed
    get countAll() {
        return this._items.length;
    }

    @computed
    get countCompleted() {
        return this._items.filter(item => item.done).length;
    }

    @computed
    get countUncompleted() {
        return this._items.filter(item => !item.done).length;
    }

    @action('添加任务')
    addItem = (name) => {
        if (name) {
            this._items.push(new Todo(name, false, this));
        }
    };

    @action('筛选全部')
    filterAll = () => {
        this.filter = ALL;
    };

    @action('筛选已完成的')
    filterCompleted = () => {
        this.filter = COMPLETED;
    };

    @action('筛选未完成的')
    filterUncompleted = () => {
        this.filter = UNCOMPLETED;
    }

}


class Todo {

    id = `${Date.now()}${Math.floor(Math.random()*1000)}`;

    @observable
    name = '';

    @observable
    done = false;

    todos = null;

    constructor(name, done, todos) {
        this.name = name;
        this.done = done;
        this.todos = todos;
    }

    @action('任务 已完成/未完成 状态切换')
    switchDone = () => {
        this.done = !this.done;
    };

    @action('删除当前项')
    remove = () => {
        if (this.todos) {
            this.todos._items.remove(this);
        }
    }
}


// Stateless Functional Component （无状态的功能组件）
const FilterButton = function(props) {

    const { onPress, children, active, size } = props;

    let buttnStyle, buttonTextStyle;
    if (active) {
        buttnStyle = {backgroundColor: 'green'};
        buttonTextStyle = {color: 'white'};
    } else {
        buttnStyle = {backgroundColor: '#F7F7F7'};
        buttonTextStyle = {color: '#666'};
    }

    return (
        <TouchableOpacity onPress={onPress} disabled={active}>
            <View style={[styles.condition, buttnStyle]}>
                <Text style={[styles.conditionText, buttonTextStyle]}>{children}({size})</Text>
            </View>
        </TouchableOpacity>
    );
};


class Header extends Component {

    static propTypes = {
        data: PropTypes.instanceOf(TodoList)
    };

    addItem = () => {
        const { data } = this.props;
        if (this.inputValue === undefined || this.inputValue.replace(/\s+/g, '') === '') {
            return alert('请输入任务名称');
        }
        data.addItem(this.inputValue);

        // clear input & reset input value
        this.input.clear();
        this.inputValue = '';
        Keyboard.dismiss();
    };

    render() {
        return (
            <View style={styles.header}>
                <TextInput
                    style={styles.input}
                    ref={input => this.input = input}
                    underlineColorAndroid='transparent'
                    placeholder='在此输入新增的任务'
                    onChangeText={text => this.inputValue = text}
                    maxLength={10}
                />
                <TouchableOpacity onPress={this.addItem} style={styles.button}>
                    <Text style={styles.buttonText}>Add Todo</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


@observer
class ShowTodos extends Component {

    static propTypes = {
        data: PropTypes.instanceOf(TodoList)
    };

    renderRow = (data) => {
        return (<TodoItem data={data}/>)
    };

    render() {
        const { data } = this.props;
        return (
            <View style={styles.showTodos}>
                <ListView
                    style={styles.listView}
                    enableEmptySections
                    initialListSize={data.items.length}
                    dataSource={ds.cloneWithRows(data.items.slice())}
                    renderRow={this.renderRow}
                />
            </View>
        );
    }

}


@observer
class Filter extends Component {

    static propTypes = {
        data: PropTypes.instanceOf(TodoList)
    };

    render() {
        const { data } = this.props;
        return (
            <View style={styles.filter}>
                <Text>筛选：</Text>
                <FilterButton size={data.countAll} active={data.filter === ALL} onPress={data.filterAll}>全部</FilterButton>
                <FilterButton size={data.countCompleted} active={data.filter === COMPLETED} onPress={data.filterCompleted}>已完成</FilterButton>
                <FilterButton size={data.countUncompleted} active={data.filter === UNCOMPLETED} onPress={data.filterUncompleted}>未完成</FilterButton>
            </View>
        );
    }
}


@observer
class TodoItem extends Component {

    static propTypes = {
        data: PropTypes.instanceOf(Todo)
    };

    render() {
        const { data } = this.props;
        let flag;
        if (data.done) {
            flag = { textDecorationLine: 'line-through' };
        } else {
            flag = { textDecorationLine: 'none' };
        }
        return (
            <TouchableOpacity onPress={data.switchDone}>
                <View style={styles.item}>
                    <Text style={[styles.name, flag]} numberOfLines={1}>{data.name}</Text>
                    <Text style={[styles.done, flag]}>{data.done ? '已完成' : '未完成'}</Text>
                    <TouchableOpacity style={styles.del} onPress={data.remove}>
                        <Text style={styles.delText}>x</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
}


class App extends Component {

    todoList = new TodoList();

    render() {
        return (
            <View style={styles.container}>
                <Header data={this.todoList}/>
                <ShowTodos data={this.todoList}/>
                <Filter data={this.todoList}/>
            </View>
        );
    }

}



export default App;