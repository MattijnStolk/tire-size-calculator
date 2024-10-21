'use client'

import { useEffect, useState } from "react";
import CurrencyInput from 'react-currency-input-field';

export default function Home() {
	const [netto, setNetto] = useState<number | null | undefined>(0);
	const [inchEuros, setInchEuros] = useState(24);
	const [price, setPrice] = useState<number | undefined>();

	const options = [
		{ value: 24, label: '13' },
		{ value: 26, label: '14' },
		{ value: 32, label: '15' },
		{ value: 37, label: '16' },
		{ value: 42, label: '17' },
		{ value: 47, label: '18' },
		{ value: 52, label: '19' },
	]

	useEffect(() => {
		if (!netto || !inchEuros) {
			setPrice(undefined);
		} else {
			setPrice(netto + inchEuros);
		}
	}, [netto, inchEuros]);

	return (
		<div>
			<div className="m-10 flex flex-col text-3xl">
				<h1 className="mb-10" >Jaap&apos;s banden berekener</h1>
				<div className="flex gap-10">
					<label htmlFor="netto">Netto</label>
					<CurrencyInput
						id="netto"
						name="netto"
						placeholder="Netto banden prijs"
						decimalsLimit={2}
						onValueChange={(value, name, values) => setNetto(values?.float)}
						className="bg-gray-700 border border-green-600 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
					/>
				</div>
				<div className="flex gap-14">
					<label htmlFor="inch">Inch</label>
					<select
						className="bg-gray-700 border border-green-600 text-gray-50 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
						value={inchEuros}
						onChange={e => setInchEuros(Number(e.target.value))}
					>
						{options.map(option => (
							<option key={option.value} value={option.value}>{option.label}</option>
						))}
					</select>
				</div>
			</div>
			<div className="flex flex-col gap-3 m-10 text-3xl">
				<p
					className="cursor-pointer"
					onClick={() => { navigator.clipboard.writeText((price ?? 0).toFixed(2)) }}
				>
					Zonder BTW: {price?.toFixed(2)}
				</p>
				<p
					onClick={() => { navigator.clipboard.writeText((Math.round(((price ?? 0) * 1.21) * 100) / 100).toFixed(2)) }}
					className="cursor-pointer"
				>
					Met BTW: {(Math.round(((price ?? 0) * 1.21) * 100) / 100).toFixed(2)}
				</p>
			</div>
		</div>
	);
}
