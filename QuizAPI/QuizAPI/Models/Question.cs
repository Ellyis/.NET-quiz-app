using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace QuizAPI.Models
{
    public class Question
    {
        //[Key]
        //public int QuestionId { get; set; }

        //[Column(TypeName = "nvarchar(250)")]
        //public string? QuestionInWords { get; set; }

        //[Column(TypeName = "nvarchar(50)")]
        //public string? ImageName { get; set; }

        //[Column(TypeName = "nvarchar(50)")]
        //public string? Option1 { get; set; }

        //[Column(TypeName = "nvarchar(50)")]
        //public string? Option2 { get; set; }

        //[Column(TypeName = "nvarchar(50)")]
        //public string? Option3 { get; set; }

        //[Column(TypeName = "nvarchar(50)")]
        //public string? Option4 { get; set; }

        //public int Answer { get; set; }
        [BsonId]
        public ObjectId Id { get; set; }
        public string? QuestionInWords { get; set; }
        public string? ImageName { get; set; }
        public string? Option1 { get; set; }
        public string? Option2 { get; set; }
        public string? Option3 { get; set; }
        public string? Option4 { get; set; }
        public int Answer { get; set; }
        public Question(string questionInWords, string imageName, string option1, string option2, string option3, string option4, int answer)
        {
            this.QuestionInWords = questionInWords;
            this.ImageName = imageName;
            this.Option1 = option1;
            this.Option2 = option2;
            this.Option3 = option3;
            this.Option4 = option4;
            this.Answer = answer;
        }

    }
}
