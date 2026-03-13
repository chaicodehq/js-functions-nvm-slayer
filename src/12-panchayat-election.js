/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  const candidateMap = new Map()
  const votes = {}
  const registered = new Map()
  const voted = new Set()

  if (Array.isArray(candidates)) {
    for (const c of candidates) {
      candidateMap.set(c.id, c)
      votes[c.id] = 0
    }
  }

  function registerVoter(voter) {
    if (
      !voter ||
      typeof voter !== "object" ||
      !voter.id ||
      registered.has(voter.id) ||
      typeof voter.age !== "number" ||
      voter.age < 18
    ) {
      return false
    }

    registered.set(voter.id, voter)
    return true
  }

  function castVote(voterId, candidateId, onSuccess, onError) {
    if (!registered.has(voterId)) {
      return typeof onError === "function" ? onError("voter_not_registered") : undefined
    }

    if (!candidateMap.has(candidateId)) {
      return typeof onError === "function" ? onError("candidate_not_found") : undefined
    }

    if (voted.has(voterId)) {
      return typeof onError === "function" ? onError("already_voted") : undefined
    }

    votes[candidateId] = (votes[candidateId] || 0) + 1
    voted.add(voterId)

    if (typeof onSuccess === "function") {
      return onSuccess({ voterId, candidateId })
    }
  }

  function getResults(sortFn) {
    const results = []

    for (const c of candidateMap.values()) {
      results.push({
        id: c.id,
        name: c.name,
        party: c.party,
        votes: votes[c.id] || 0
      })
    }

    if (typeof sortFn === "function") {
      results.sort(sortFn)
    } else {
      results.sort((a, b) => b.votes - a.votes)
    }

    return results
  }

  function getWinner() {
    let max = -1
    let winner = null

    for (const c of candidateMap.values()) {
      const v = votes[c.id] || 0
      if (v > max) {
        max = v
        winner = c
      }
    }

    if (max === 0) return null
    return winner
  }

  return {
    registerVoter,
    castVote,
    getResults,
    getWinner
  }
}

export function createVoteValidator(rules) {
  return function (voter) {
    if (!rules || typeof rules !== "object") {
      return { valid: false, reason: "invalid_rules" }
    }

    if (!voter || typeof voter !== "object") {
      return { valid: false, reason: "invalid_voter" }
    }

    if (Array.isArray(rules.requiredFields)) {
      for (const f of rules.requiredFields) {
        if (!(f in voter)) {
          return { valid: false, reason: "missing_" + f }
        }
      }
    }

    if (typeof rules.minAge === "number" && voter.age < rules.minAge) {
      return { valid: false, reason: "underage" }
    }

    return { valid: true, reason: null }
  }
}

export function countVotesInRegions(regionTree) {
  if (!regionTree || typeof regionTree !== "object") return 0

  let total = typeof regionTree.votes === "number" ? regionTree.votes : 0

  if (Array.isArray(regionTree.subRegions)) {
    for (const r of regionTree.subRegions) {
      total += countVotesInRegions(r)
    }
  }

  return total
}

export function tallyPure(currentTally, candidateId) {
  const base = currentTally && typeof currentTally === "object" ? currentTally : {}
  const prev = base[candidateId] || 0

  return {
    ...base,
    [candidateId]: prev + 1
  }
}
