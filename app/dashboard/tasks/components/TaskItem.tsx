type TaskItemProps = {
	id: string;
	title: string;
	completed: boolean;
};

function TaskItemProps({}: TaskItemProps) {
	return (
		<div className="flex items-center justify-center py-20">
			<p className="text-gray-500">Page compo</p>
		</div>
	);
}

export default TaskItemProps;
