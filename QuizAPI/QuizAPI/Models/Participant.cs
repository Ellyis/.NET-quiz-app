using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace QuizAPI.Models
{
    public class Participant
    {
        //[Key]
        //public int ParticipantId { get; set; }

        //[Column(TypeName = "nvarchar(50)")]
        //public string? Email { get; set; }

        //[Column(TypeName = "nvarchar(50)")]
        //public string? Name { get; set; }

        //public int Score { get; set; }

        //public int TimeTaken { get; set; }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId Id { get; set; }
        public string? Email { get; set; }
        public string? Name { get; set; }
        public int Score { get; set; }
        public int TimeTaken { get; set; }

        public Participant(string email, string name, int score, int timeTaken) 
        {
            this.Email = email;
            this.Name = name;
            this.Score = score;
            this.TimeTaken = timeTaken;
        }
    }
}
