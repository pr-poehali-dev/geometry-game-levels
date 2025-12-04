import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

type Level = {
  id: number;
  title: string;
  topic: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  formula?: string;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

const levels: Level[] = [
  {
    id: 1,
    title: 'Площадь треугольника',
    topic: 'Треугольники',
    question: 'Найди площадь треугольника с основанием 8 см и высотой 5 см',
    answers: ['20 см²', '40 см²', '13 см²', '80 см²'],
    correctAnswer: 0,
    explanation: 'S = (a × h) / 2 = (8 × 5) / 2 = 20 см²',
    difficulty: 'easy',
    formula: 'S = (a × h) / 2'
  },
  {
    id: 2,
    title: 'Периметр треугольника',
    topic: 'Треугольники',
    question: 'Периметр равностороннего треугольника 24 см. Найди длину одной стороны.',
    answers: ['6 см', '8 см', '12 см', '4 см'],
    correctAnswer: 1,
    explanation: 'P = 3a, следовательно a = P / 3 = 24 / 3 = 8 см',
    difficulty: 'easy',
    formula: 'P = a + b + c'
  },
  {
    id: 3,
    title: 'Теорема Пифагора',
    topic: 'Треугольники',
    question: 'В прямоугольном треугольнике катеты равны 3 см и 4 см. Найди гипотенузу.',
    answers: ['7 см', '5 см', '6 см', '25 см'],
    correctAnswer: 1,
    explanation: 'c² = a² + b² = 9 + 16 = 25, следовательно c = 5 см',
    difficulty: 'medium',
    formula: 'c² = a² + b²'
  },
  {
    id: 4,
    title: 'Сумма углов треугольника',
    topic: 'Углы',
    question: 'Два угла треугольника равны 45° и 60°. Найди третий угол.',
    answers: ['75°', '105°', '90°', '120°'],
    correctAnswer: 0,
    explanation: 'Сумма углов = 180°, следовательно третий угол = 180° - 45° - 60° = 75°',
    difficulty: 'easy',
    formula: 'α + β + γ = 180°'
  },
  {
    id: 5,
    title: 'Площадь по формуле Герона',
    topic: 'Треугольники',
    question: 'Стороны треугольника: 5 см, 6 см, 7 см. Полупериметр p = 9. Найди площадь (√6 ≈ 2.45).',
    answers: ['12 см²', '14.7 см²', '18 см²', '21 см²'],
    correctAnswer: 1,
    explanation: 'S = √(p(p-a)(p-b)(p-c)) = √(9×4×3×2) = √216 ≈ 14.7 см²',
    difficulty: 'hard',
    formula: 'S = √(p(p-a)(p-b)(p-c))'
  },
  {
    id: 6,
    title: 'Внешний угол треугольника',
    topic: 'Углы',
    question: 'Внутренние углы при основании треугольника 50° и 60°. Найди внешний угол при вершине.',
    answers: ['110°', '120°', '130°', '70°'],
    correctAnswer: 0,
    explanation: 'Внешний угол = сумме двух внутренних несмежных = 50° + 60° = 110°',
    difficulty: 'medium',
    formula: 'Внешний угол = α + β'
  }
];

const initialAchievements: Achievement[] = [
  { id: 'first', title: 'Первый шаг', description: 'Решил первую задачу', icon: 'Star', unlocked: false },
  { id: 'three', title: 'Троечник', description: 'Решил 3 задачи подряд', icon: 'Award', unlocked: false },
  { id: 'perfect', title: 'Перфекционист', description: 'Решил задачу с первого раза', icon: 'Trophy', unlocked: false },
  { id: 'master', title: 'Мастер геометрии', description: 'Прошел все уровни', icon: 'Crown', unlocked: false },
];

const Index = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [showFormulas, setShowFormulas] = useState(false);
  const [streak, setStreak] = useState(0);

  const handleAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === levels[currentLevel].correctAnswer;
    setShowResult(true);

    if (isCorrect) {
      const newScore = score + (levels[currentLevel].difficulty === 'hard' ? 30 : levels[currentLevel].difficulty === 'medium' ? 20 : 10);
      setScore(newScore);
      setStreak(streak + 1);
      
      if (!completedLevels.includes(currentLevel)) {
        setCompletedLevels([...completedLevels, currentLevel]);
      }

      toast.success('Правильно! 🎉', {
        description: levels[currentLevel].explanation
      });

      unlockAchievements(isCorrect);
    } else {
      setStreak(0);
      toast.error('Неправильно 😢', {
        description: 'Попробуй еще раз или посмотри подсказку!'
      });
    }
  };

  const unlockAchievements = (correct: boolean) => {
    const newAchievements = [...achievements];
    
    if (completedLevels.length === 0 && !achievements[0].unlocked) {
      newAchievements[0].unlocked = true;
      toast.success('🏆 Достижение разблокировано: Первый шаг!');
    }
    
    if (streak + 1 >= 3 && !achievements[1].unlocked) {
      newAchievements[1].unlocked = true;
      toast.success('🏆 Достижение разблокировано: Троечник!');
    }
    
    if (selectedAnswer === levels[currentLevel].correctAnswer && !showResult && !achievements[2].unlocked) {
      newAchievements[2].unlocked = true;
      toast.success('🏆 Достижение разблокировано: Перфекционист!');
    }
    
    if (completedLevels.length + 1 === levels.length && !achievements[3].unlocked) {
      newAchievements[3].unlocked = true;
      toast.success('🏆 Достижение разблокировано: Мастер геометрии!');
    }
    
    setAchievements(newAchievements);
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const resetLevel = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const progress = (completedLevels.length / levels.length) * 100;
  const level = levels[currentLevel];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-primary mb-2 flex items-center justify-center gap-3">
            <span className="text-6xl animate-bounce-slow">📐</span>
            Геометрия Квест
            <span className="text-6xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>✨</span>
          </h1>
          <p className="text-lg text-muted-foreground">Изучай формулы через приключения!</p>
        </header>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 bg-white/80 backdrop-blur hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Trophy" className="text-primary" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Очки</p>
                <p className="text-2xl font-bold text-primary">{score}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Icon name="Target" className="text-accent" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Прогресс</p>
                <p className="text-2xl font-bold text-accent">{completedLevels.length}/{levels.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white/80 backdrop-blur hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Icon name="Flame" className="text-secondary" size={24} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Серия</p>
                <p className="text-2xl font-bold text-secondary">{streak} 🔥</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Общий прогресс</span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <Card className="p-8 mb-6 bg-white/90 backdrop-blur shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-sm">{level.topic}</Badge>
                <Badge 
                  variant={level.difficulty === 'hard' ? 'destructive' : level.difficulty === 'medium' ? 'default' : 'secondary'}
                >
                  {level.difficulty === 'hard' ? 'Сложно' : level.difficulty === 'medium' ? 'Средне' : 'Легко'}
                </Badge>
              </div>
              <h2 className="text-3xl font-bold text-foreground">{level.title}</h2>
            </div>
            <div className="text-5xl animate-float">
              {currentLevel % 3 === 0 ? '📐' : currentLevel % 3 === 1 ? '📏' : '🔺'}
            </div>
          </div>

          {level.formula && (
            <Card className="p-4 mb-6 bg-purple-50 border-2 border-purple-200">
              <p className="text-center text-lg font-semibold text-purple-900">
                Формула: <code className="bg-white px-3 py-1 rounded">{level.formula}</code>
              </p>
            </Card>
          )}

          <p className="text-xl mb-6 text-foreground font-medium">{level.question}</p>

          <div className="grid gap-3 mb-6">
            {level.answers.map((answer, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === level.correctAnswer;
              const showCorrect = showResult && isCorrect;
              const showWrong = showResult && isSelected && !isCorrect;

              return (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  variant={isSelected ? 'default' : 'outline'}
                  size="lg"
                  className={`justify-start text-lg h-auto py-4 transition-all hover:scale-[1.02] ${
                    showCorrect ? 'bg-green-500 hover:bg-green-600 text-white border-green-600' :
                    showWrong ? 'bg-red-500 hover:bg-red-600 text-white border-red-600' :
                    isSelected ? 'bg-primary' : ''
                  }`}
                  disabled={showResult}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {answer}
                  {showCorrect && <Icon name="Check" className="ml-auto" size={24} />}
                  {showWrong && <Icon name="X" className="ml-auto" size={24} />}
                </Button>
              );
            })}
          </div>

          {showResult && (
            <Card className={`p-4 mb-6 ${selectedAnswer === level.correctAnswer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2 animate-scale-in`}>
              <p className="font-medium text-lg mb-2">
                {selectedAnswer === level.correctAnswer ? '🎉 Отлично!' : '💡 Объяснение:'}
              </p>
              <p className="text-foreground">{level.explanation}</p>
            </Card>
          )}

          <div className="flex gap-3">
            {!showResult ? (
              <Button 
                onClick={checkAnswer} 
                disabled={selectedAnswer === null}
                size="lg"
                className="flex-1 text-lg"
              >
                <Icon name="CheckCircle" className="mr-2" size={20} />
                Проверить ответ
              </Button>
            ) : (
              <>
                <Button 
                  onClick={resetLevel}
                  variant="outline"
                  size="lg"
                  className="flex-1 text-lg"
                >
                  <Icon name="RotateCcw" className="mr-2" size={20} />
                  Попробовать снова
                </Button>
                {currentLevel < levels.length - 1 && (
                  <Button 
                    onClick={nextLevel}
                    size="lg"
                    className="flex-1 text-lg"
                  >
                    Следующий уровень
                    <Icon name="ArrowRight" className="ml-2" size={20} />
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/90 backdrop-blur">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Award" className="text-primary" size={28} />
              <h3 className="text-2xl font-bold">Достижения</h3>
            </div>
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300' 
                      : 'bg-gray-50 opacity-50'
                  }`}
                >
                  <div className={`text-3xl ${achievement.unlocked ? 'animate-bounce-slow' : 'grayscale'}`}>
                    <Icon name={achievement.icon as any} size={32} />
                  </div>
                  <div>
                    <p className="font-semibold">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="BookOpen" className="text-accent" size={28} />
              <h3 className="text-2xl font-bold">Справочник формул</h3>
            </div>
            <Button 
              onClick={() => setShowFormulas(true)}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Icon name="BookMarked" className="mr-2" size={20} />
              Открыть справочник
            </Button>

            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-lg">Уровни:</h4>
              <div className="space-y-2">
                {levels.map((lvl, idx) => (
                  <div 
                    key={lvl.id}
                    className={`flex items-center gap-2 p-2 rounded ${
                      completedLevels.includes(idx) ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    {completedLevels.includes(idx) ? (
                      <Icon name="CheckCircle2" className="text-green-600" size={20} />
                    ) : (
                      <Icon name="Circle" className="text-gray-400" size={20} />
                    )}
                    <span className="text-sm font-medium">{lvl.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <Dialog open={showFormulas} onOpenChange={setShowFormulas}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Icon name="BookOpen" size={28} />
                Справочник формул геометрии
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="triangles" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="triangles">Треугольники</TabsTrigger>
                <TabsTrigger value="angles">Углы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="triangles" className="space-y-4">
                <Card className="p-4 bg-purple-50">
                  <h4 className="font-semibold mb-2">Площадь треугольника</h4>
                  <code className="bg-white px-3 py-1 rounded block mb-2">S = (a × h) / 2</code>
                  <p className="text-sm text-muted-foreground">где a - основание, h - высота</p>
                </Card>
                
                <Card className="p-4 bg-blue-50">
                  <h4 className="font-semibold mb-2">Периметр треугольника</h4>
                  <code className="bg-white px-3 py-1 rounded block mb-2">P = a + b + c</code>
                  <p className="text-sm text-muted-foreground">сумма всех сторон</p>
                </Card>
                
                <Card className="p-4 bg-green-50">
                  <h4 className="font-semibold mb-2">Теорема Пифагора</h4>
                  <code className="bg-white px-3 py-1 rounded block mb-2">c² = a² + b²</code>
                  <p className="text-sm text-muted-foreground">для прямоугольного треугольника</p>
                </Card>
                
                <Card className="p-4 bg-orange-50">
                  <h4 className="font-semibold mb-2">Формула Герона</h4>
                  <code className="bg-white px-3 py-1 rounded block mb-2">S = √(p(p-a)(p-b)(p-c))</code>
                  <p className="text-sm text-muted-foreground">где p = (a+b+c)/2 - полупериметр</p>
                </Card>
              </TabsContent>
              
              <TabsContent value="angles" className="space-y-4">
                <Card className="p-4 bg-pink-50">
                  <h4 className="font-semibold mb-2">Сумма углов треугольника</h4>
                  <code className="bg-white px-3 py-1 rounded block mb-2">α + β + γ = 180°</code>
                  <p className="text-sm text-muted-foreground">всегда равна 180 градусам</p>
                </Card>
                
                <Card className="p-4 bg-yellow-50">
                  <h4 className="font-semibold mb-2">Внешний угол треугольника</h4>
                  <code className="bg-white px-3 py-1 rounded block mb-2">Внешний угол = α + β</code>
                  <p className="text-sm text-muted-foreground">равен сумме двух несмежных внутренних углов</p>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
