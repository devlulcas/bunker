const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric'
});

export function formatDate(dateString: string) {
	return dateFormatter.format(new Date(dateString));
}

type Priority = 'none' | 'low' | 'medium' | 'high' | 'urgent';

export function formatPriority(priority: number): Priority {
	const priorities: Priority[] = ['none', 'low', 'medium', 'high', 'urgent'];
	return priorities[priority] || 'none';
}

export const PRIORITY_COLORS = {
	none: 'text-gray-600 bg-gray-100',
	low: 'text-green-600 bg-green-100',
	medium: 'text-yellow-600 bg-yellow-100',
	high: 'text-orange-600 bg-orange-100',
	urgent: 'text-red-600 bg-red-100'
} as const satisfies Record<Priority, string>;

export const PRIORITY_LABELS = {
	none: 'nenhuma',
	low: 'baixa',
	medium: 'média',
	high: 'alta',
	urgent: 'urgente'
} as const satisfies Record<Priority, string>;

export function getPriorityColor(priority: number): string {
	return PRIORITY_COLORS[formatPriority(priority)] || PRIORITY_COLORS.none;
}

const TRANSLATED_LABELS = {
	me: 'pessoal',
	work: 'trabalho',
	home: 'casa',
	family: 'familia',
	friends: 'amigos',
	school: 'escola'
};

export type Label = keyof typeof TRANSLATED_LABELS;

export function formatLabel(label: string): [string, Label] {
	return [TRANSLATED_LABELS[label as Label] || label, label as Label];
}

const listFormatter = new Intl.ListFormat('pt-BR', {
	type: 'conjunction'
});

export function formatList(labels: Label[]): string {
	return listFormatter.format(labels.map((label) => TRANSLATED_LABELS[label]));
}
