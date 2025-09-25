import type { Request, Response } from "express";
import { config } from "../config";
import { BadRequestError, NotFoundError } from "../lib/classes/errors";

export async function handlerLeague(_: Request, res: Response) {
	const leagueId = config.league.id;
	const league = await getLeague(leagueId),
		leagueRoster = await getLeagueRosters(leagueId),
		leagueUsers = await getLeagueUsers(leagueId),
		thisWeeksLeaguesMatchups = await getThisWeeksLeagueMatchups(
			leagueId,
			3
		),
		leagueWinnersBracket = await getLeaguePlayoffBracket(
			leagueId,
			"winners_bracket"
		),
		leagueTransactionsWeekThree = await getLeagueTransaction(leagueId, 3),
		nflState = await getNFLState("nfl");
	const data = {
		league,
		leagueRoster,
		leagueUsers,
		thisWeeksLeaguesMatchups,
		leagueWinnersBracket,
		leagueTransactionsWeekThree,
		nflState
	};

	res.send(data);
}

export async function getLeague(leagueId: string) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}`;
	const league = await fetch(url);

	if (!league)
		throw new NotFoundError(
			"The league was not found. Please make sure your League ID is correct."
		);

	return await league.json();
}

export async function getLeagueRosters(leagueId: string) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}/rosters`;
	const leagueRosters = await fetch(url);

	if (!leagueRosters)
		throw new NotFoundError(
			`No rosters were found for League ID: ${leagueId}. Please make sure your League ID is correct.`
		);

	return await leagueRosters.json();
}

export async function getLeagueUsers(leagueId: string) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}/users`;
	const leagueUsers = await fetch(url);

	if (!leagueUsers)
		throw new NotFoundError(
			`No users were found for League ID: ${leagueId}. Please make sure your League ID is correct.`
		);

	return await leagueUsers.json();
}

export async function getThisWeeksLeagueMatchups(
	leagueId: string,
	week: number
) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`;
	const leagueMatchups = await fetch(url);

	if (!leagueMatchups)
		throw new NotFoundError(
			`No league matchups were found for League ID: ${leagueId}. Please make sure your League ID is correct.`
		);

	return await leagueMatchups.json();
}

// attempted loses_bracket, currently resulting in a 404, try again in the future
export async function getLeaguePlayoffBracket(
	leagueId: string,
	bracket: "winners_bracket" | "loses_bracket"
) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}/${bracket}`;
	const playoffBracket = await fetch(url);

	if (!playoffBracket)
		throw new NotFoundError(
			`No playoff brackets were found for League ID: ${leagueId}. Please make sure your League ID is correct.`
		);

	return await playoffBracket.json();
}

export async function getLeagueTransaction(leagueId: string, week: number) {
	const url = `https://api.sleeper.app/v1/league/${leagueId}/transactions/${week}`;
	const leagueTransactions = await fetch(url);
	if (!leagueTransactions)
		throw new NotFoundError(
			`No transactions found. Either a single transaction wasn't made or perhaps your League ID: ${leagueId} is incorrect.`
		);

	return await leagueTransactions.json();
}

export async function getNFLState(sport: "nfl") {
	const url = `https://api.sleeper.app/v1/state/${sport}`;
	const nflState = await fetch(url);

	if (!nflState)
		throw new NotFoundError(
			`The current state of the NFL according to sleeper was not found. Please check the spelling of the sport: ${sport}`
		);

	return await nflState.json();
}
