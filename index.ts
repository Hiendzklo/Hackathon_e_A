interface ITodoList {
    id: number;
    name: string;
    completed: boolean;
}

class TodoList {
    private todoList: ITodoList[];

    constructor() {
        this.todoList = this.loadTasks();
        this.setupListeners();
        this.renderJob();
    }
/* 
    Load danh sách công việc từ local storage
    Auth: Nguyễn Duy Hiển (07/05/2024)
*/
    private loadTasks(): ITodoList[] {
        const tasksJson = localStorage.getItem('todoList');
        return tasksJson ? JSON.parse(tasksJson) : [];
    }
/* 
    Thiết lập các sự kiện cho nút Add và các nút Delete
    Auth: Nguyễn Duy Hiển (07/05/2024)
*/
    private setupListeners(): void {
        const addButton = document.querySelector('.btn') as HTMLElement;
        addButton.addEventListener('click', () => {
            const inputElement = document.querySelector('.input-box') as HTMLInputElement;
            this.createJob(inputElement.value);
            inputElement.value = ''; // Xóa nội dung trong input sau khi thêm
        });

        const deleteDoneButton = document.querySelector('.btn-red:first-child') as HTMLElement;
        deleteDoneButton.addEventListener('click', () => this.deleteDoneJobs());

        const deleteAllButton = document.querySelector('.btn-red:last-child') as HTMLElement;
        deleteAllButton.addEventListener('click', () => this.deleteAllJobs());
    }
/* 
    Hiển thị danh sách công việc lên giao diện todoList
    Auth: Nguyễn Duy Hiển (07/05/2024)
*/
    renderJob(): void {
        const listContainer = document.querySelector('.todo-list ul') as HTMLElement;
        listContainer.innerHTML = ''; // Xóa danh sách hiện có
        this.todoList.forEach(task => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span ${task.completed ? 'style="text-decoration: line-through;"' : ''}>${task.name}</span>
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                onchange="todoList.updateJob(${task.id}, this)">
                <button class="edit" onclick="todoList.editJob(${task.id})">✏️</button>
                <button class="delete" onclick="todoList.deleteJob(${task.id})">🗑️</button>
            `;
            listContainer.appendChild(listItem);
        });
    }
/* 
    Tạo công việc mới và lưu vào local storage
    Auth: Nguyễn Duy Hiển (07/05/2024)
*/
    createJob(name: string): void {
        if (!name.trim() || this.todoList.some(task => task.name === name)) {
            alert('Tên công việc không được để trống hoặc trùng lặp');
            return;
        }
        const newTask = { id: Date.now(), name, completed: false };
        this.todoList.push(newTask);
        localStorage.setItem('todoList', JSON.stringify(this.todoList));
        this.renderJob();
    }
/* 
    Cập nhật trạng thái hoàn thành của công việc
    Auth: Nguyễn Duy Hiển (07/05/2024)
*/
    updateJob(id: number, checkbox: HTMLInputElement): void {
        const task = this.todoList.find(task => task.id === id);
        if (task) {
            task.completed = checkbox.checked;
            localStorage.setItem('todoList', JSON.stringify(this.todoList));
            this.renderJob();
        }
    }
/* 
    Chỉnh sửa tên của công việc
    Auth: Nguyễn Duy Hiển (07/05/2024)
*/
    editJob(id: number): void {
        const task = this.todoList.find(task => task.id === id);
        if (task) {
            const newName = prompt('chỉnh sửa công việc:', task.name);
            if (newName && newName.trim()) {
                task.name = newName.trim();
                localStorage.setItem('todoList', JSON.stringify(this.todoList));
                this.renderJob();
            } else {
                alert('công việc không được để trống.');
            }
        }
    }
/* 
    Xóa một công việc bằng cách lọc ra Id
    Auth: Nguyễn Duy Hiển (07/05/2024)
*/
    deleteJob(id: number): void {
        if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
            this.todoList = this.todoList.filter(task => task.id !== id);
            localStorage.setItem('todoList', JSON.stringify(this.todoList));
            this.renderJob();
        }
    }
/* 
    Xóa tất cả các công việc đã hoàn thành bằng cách lọc theo trạng thái compeleted
    Auth: Nguyễn Duy Hiển (07/05/2024)
*/
    deleteDoneJobs(): void {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả các công việc đã Hoàn Thành?')) {
            this.todoList = this.todoList.filter(task => !task.completed);
            localStorage.setItem('todoList', JSON.stringify(this.todoList));
            this.renderJob();
        }
    }
/* 
    Xóa tất cả các công việc đang được hiện thị ở giao diện
    Auth: Nguyễn Duy Hiển (07/05/2024)
*/
    deleteAllJobs(): void {
        if (confirm('Bạn có chắc chắn muốn xóa tất cả các công việc?')) {
            this.todoList = [];
            localStorage.setItem('todoList', JSON.stringify(this.todoList));
            this.renderJob();
        }
    }
}

// Khởi tạo đối tượng TodoList khi tài liệu đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    (window as any).todoList = new TodoList(); // Tham chiếu toàn cục đến đối tượng
});
