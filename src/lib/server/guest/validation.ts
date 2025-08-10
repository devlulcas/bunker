import * as v from 'valibot';

const AllowedPages = v.pipe(
	v.array(v.string('As páginas permitidas são obrigatórias')),
	v.nonEmpty('As páginas permitidas são obrigatórias')
);

const DurationHours = v.pipe(
	v.number('A duração é obrigatória'),
	v.minValue(1, 'A duração deve ser maior que 0'),
	v.maxValue(8760, 'A duração deve ser menor que 8760')
);

export type CreateGuestLink = v.InferOutput<typeof CreateGuestLink>;
export const CreateGuestLink = v.object({
	username: v.string('Nome de usuário é obrigatório'),
	allowedPages: AllowedPages,
	durationHours: DurationHours
});
