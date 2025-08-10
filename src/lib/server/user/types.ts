import * as v from 'valibot';

export type Username = v.InferOutput<typeof Username>;
export const Username = v.pipe(
	v.string('Nome de usuário é obrigatório'),
	v.nonEmpty('Nome de usuário é obrigatório'),
	v.maxLength(255, 'Nome de usuário deve ter menos de 255 caracteres'),
	v.minLength(3, 'Nome de usuário deve ter mais de 3 caracteres'),
	v.regex(
		/^[a-zA-Z0-9_-]+$/,
		'Nome de usuário deve conter apenas letras, números, hifens e underscores'
	)
);

export type Password = v.InferOutput<typeof Password>;
export const Password = v.pipe(
	v.string('Senha é obrigatória'),
	v.nonEmpty('Senha é obrigatória'),
	v.maxLength(255, 'Senha deve ter menos de 255 caracteres'),
	v.minLength(8, 'Senha deve ter mais de 8 caracteres')
);

export type CreateUser = v.InferOutput<typeof CreateUser>;
export const CreateUser = v.object({
	username: Username,
	password: Password
});

export type LoginUser = v.InferOutput<typeof LoginUser>;
export const LoginUser = CreateUser;

export type PublicUser = {
	id: string;
	username: string;
	role: 'admin' | null;
};
