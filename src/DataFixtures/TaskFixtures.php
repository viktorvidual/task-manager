<?php

namespace App\DataFixtures;

use App\Entity\Task;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class TaskFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $task = new Task();
        $task->setTitle("Fix my car");
        $task->setDescription("Check if tires need to be changed");
        $task->setCreatedOn(new \DateTime());
        $task->setDueDate((new \DateTime())->modify('+1 week'));
        $task->setIsDone(false);
        //add relational data
        $manager->persist($task);

        $task1 = new Task();
        $task1->setTitle("Go to the dentist");
        $task1->setDescription("One of my back teeth hurts");
        $task1->setCreatedOn(new \DateTime());
        $task1->setDueDate((new \DateTime())->modify('+2 week'));
        $task1->setIsDone(false);
        //add relational data
        $manager->persist($task1);

        $task2 = new Task();
        $task2->setTitle("Clean my laptop");
        $task2->setDescription("My laptop overheats, in need to be cleaned");
        $task2->setCreatedOn(new \DateTime());
        $task2->setDueDate((new \DateTime())->modify('+1 week'));
        $task2->setIsDone(false);
        //add relational data
        $manager->persist($task1);

        $manager->flush();

        $this->addReference('task_', $task);
        $this->addReference('task_1', $task1);
        $this->addReference('task_2', $task2);

    }
}
