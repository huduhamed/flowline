type TaskListProps = {
	id: string;
	title: string;
	completed: boolean;
};

function TaskList({}: TaskListProps) {
	return (
		<div className="flex items-center justify-center py-20">
			<ul>
				<li className="text-gray-500">task 1</li>
				<li className="text-gray-500">task 2</li>
				<li className="text-gray-500">task 3</li>
			</ul>
		</div>
	);
}

export default TaskList;
