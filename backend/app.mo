import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Time "mo:base/Time";
import Hash "mo:base/Hash";

actor {
  public type SkillId = Nat;

  public type Skill = {
    id: SkillId;
    name: Text;
    startDate: Text;
    progressNote: Text;
    level: Text;
    createdAt: Time.Time;
  };

  private stable var nextId: SkillId = 0;
  private stable var stableSkills: [(SkillId, Skill)] = [];

  private var skills = HashMap.fromIter<SkillId, Skill>(
    stableSkills.vals(),
    10,
    Nat.equal,
    Hash.hash
  );

  // Create
  public func addSkill(
    name: Text,
    startDate: Text,
    progressNote: Text,
    level: Text
  ): async SkillId {
    let id = nextId;
    let skill: Skill = {
      id = id;
      name = name;
      startDate = startDate;
      progressNote = progressNote;
      level = level;
      createdAt = Time.now();
    };
    skills.put(id, skill);
    nextId += 1;
    return id;
  };

  // Read
  public query func getAllSkills(): async [Skill] {
    Iter.toArray(skills.vals())
  };

  // Update
  public func editSkill(
    id: SkillId,
    name: Text,
    startDate: Text,
    progressNote: Text,
    level: Text
  ): async Bool {
    switch (skills.get(id)) {
      case null { false };
      case (?skill) {
        skills.put(id, {
          id = skill.id;
          name = name;
          startDate = startDate;
          progressNote = progressNote;
          level = level;
          createdAt = skill.createdAt;
        });
        true
      };
    }
  };

  // Delete
  public func deleteSkill(id: SkillId): async Bool {
    skills.remove(id) != null
  };

  system func preupgrade() {
    stableSkills := Iter.toArray(skills.entries());
  };

  system func postupgrade() {
    stableSkills := [];
  };
}
