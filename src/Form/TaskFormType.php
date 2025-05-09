<?php

namespace App\Form;

use App\Entity\Task;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TaskFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType:: class, [
                'attr' => [
                    'class' => 'bg-transparent block border-b-2 w-full h-20 text-4xl outline-none',
                    'placeholder' => 'enter title',
                ],
                'label' =>  false,
            ])
            ->add('description', TextType:: class, [
                'attr' => [
                    'class' => 'bg-transparent block border-b-2 w-full h-40 text-4xl outline-none mb-2',
                    'placeholder' => 'enter description',
                ],
                'label' =>  false,
            ])

            ->add('dueDate', DateType:: class, [
                'attr' => [
                    'class' => 'bg-transparent block border-b-2 w-full h-20 text-xl outline-none m-2',
                    'placeholder' => 'enter dueDate',
                ],
 
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Task::class,
        ]);
    }
}
